from .models import Search, Address
from rest_framework import serializers


class AddressSerializerV1(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Address
        fields = (
            'formatted_address',
            'postal_code',
            'city',
            'state',
            'country',
            'temperature',
            'updated_at',
        )


class SearchSerializerV1(serializers.HyperlinkedModelSerializer):
    address = AddressSerializerV1()

    class Meta:
        model = Search
        fields = (
            'expression',
            'created_at',
            'address'
        )
