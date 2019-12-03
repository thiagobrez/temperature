from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.timezone import utc
from .serializers import SearchSerializerV1
from .models import Search, Address
from decouple import config
import datetime
import requests


class MultiSerializerViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        return self.serializers.get(self.request.version)


class SearchViewSet(MultiSerializerViewSet):
    serializers = {
        '1.0': SearchSerializerV1
        # Add serializers for further versions
    }

    def get_queryset(self):
        return Search.objects.all().order_by('-created_at')

    @action(detail=False, methods=['post'])
    def search(self, request):
        """Retrieves the current temperature for a given address. If the evaluated address
        has postal code, it is used as parameter to query the temperature, otherwise its
        coordinates are used. If the evaluated address has same postal code than another
        already in database and the search time difference is < 1 hour, the temperature
        from the cached address is used. If no address is evaluated from the given expression,
        returns an error.
        """

        def filter_address_components(result, key):
            filtered_component = next(filter(lambda i: key in i.get('types'), result.get('address_components')), None)
            return filtered_component.get('short_name') if filtered_component is not None else ''

        def address_timediff(address):
            now = datetime.datetime.utcnow().replace(tzinfo=utc)
            return (now - address.updated_at).total_seconds()

        def filter_coords(result, key):
            return result.get('geometry').get('location').get(key)

        def get_temperature(api_type, args):
            base_url = f'http://api.openweathermap.org/data/2.5/weather'

            if api_type is 'postal_code':
                query = f'?zip={args.get("postal_code")},{args.get("country")}'
            elif api_type is 'coords':
                query = f'?lat={args.get("lat")}&lon={args.get("lng")}'

            api = f'{base_url}{query}&units=imperial&APPID={config("WEATHER_API_KEY")}'
            weather = requests.get(api)

            return weather.json().get('main').get('temp')

        expression = request.data.get('expression')

        if expression:
            geocoding = requests.get(
                f'https://maps.googleapis.com/maps/api/geocode/json?address={expression}'
                f'&key={config("GEOCODING_API_KEY")}')

            results = geocoding.json().get('results')
            if not len(results):
                return Response({'error': 'Address doesnt exist'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            result = results[0]

            formatted_address = result.get('formatted_address')
            postal_code = filter_address_components(result, 'postal_code').replace('-', '')
            city = filter_address_components(result, 'administrative_area_level_2')
            state = filter_address_components(result, 'administrative_area_level_1')
            country = filter_address_components(result, 'country')

            if not postal_code:
                lat = filter_coords(result, 'lat')
                lng = filter_coords(result, 'lng')

                try:
                    address = Address.objects.get(formatted_address=formatted_address)
                    timediff = address_timediff(address)

                    if timediff > 3600:
                        address.temperature = get_temperature('coords', {'lat': lat, 'lng': lng})
                        address.save()

                except Address.DoesNotExist:
                    temperature = get_temperature('coords', {'lat': lat, 'lng': lng})

                    address = Address.objects.create(
                        formatted_address=formatted_address,
                        city=city,
                        state=state,
                        country=country,
                        temperature=temperature
                    )
            else:
                postal_code_addresses = Address.objects.filter(postal_code=postal_code, country=country)
                exact_address = postal_code_addresses.filter(formatted_address=formatted_address).first()

                address = exact_address if exact_address is not None else postal_code_addresses.first()
                temperature = None

                if address is not None:
                    temperature = address.temperature
                    timediff = address_timediff(address)

                    if timediff > 3600:
                        temperature = get_temperature('postal_code', {'postal_code': postal_code, 'country': country})
                        postal_code_addresses.update(temperature=temperature)

                if exact_address is None:
                    if temperature is None:
                        temperature = get_temperature('postal_code', {'postal_code': postal_code, 'country': country})

                    address = Address.objects.create(
                        formatted_address=formatted_address,
                        postal_code=postal_code,
                        city=city,
                        state=state,
                        country=country,
                        temperature=temperature
                    )

            search = Search.objects.create(
                expression=expression,
                address=address
            )

            serializer = self.serializers.get(self.request.version)(search)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response('Expression is required', status=status.HTTP_400_BAD_REQUEST)
