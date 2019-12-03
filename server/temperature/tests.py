from django.test import TestCase
import requests
import json


class SearchTestCase(TestCase):
    base_url = 'http://localhost:8000'
    headers = {
        'Accept': 'application/json; version=1.0',
        'Content-Type': 'application/json'
    }

    def test_address_doesnt_exist(self):
        """Tests if the entered expression won't evaluate to an address
        and return an error.
        """

        body = {'expression': 'doesnt exist'}
        search = requests.post(f'{self.base_url}/searches/search/', json=body, headers=self.headers)

        self.assertFalse(search.ok)
        self.assertJSONEqual(search.text, json.dumps({'error': 'Address doesnt exist'}))

    def test_address_without_postal_code(self):
        """Tests if when entered an expression that will evaluate to an address
        without postal code, temperature will still be known, as it will be queried
        by its coordinates.
        """

        body = {'expression': 'mountain view'}
        search = requests.post(f'{self.base_url}/searches/search/', json=body, headers=self.headers)
        data = search.json()

        self.assertTrue(search.ok)
        self.assertIn('temperature', data.get('address'))
        self.assertIn('postal_code', data.get('address'))
        self.assertFalse(bool(data.get('address').get('postal_code')))
        self.assertTrue(bool(data.get('address').get('temperature')))

    def test_address_with_postal_code(self):
        """Tests if the entered expression will evaluate to an address
        with postal code and known temperature
        """

        body = {'expression': 'rockefeller center'}
        search = requests.post(f'{self.base_url}/searches/search/', json=body, headers=self.headers)
        data = search.json()

        self.assertTrue(search.ok)
        self.assertIn('temperature', data.get('address'))
        self.assertIn('postal_code', data.get('address'))
        self.assertTrue(bool(data.get('address').get('postal_code')))
        self.assertTrue(bool(data.get('address').get('temperature')))

    def test_addresses_with_same_postal_code(self):
        """Tests if two addresses with same postal code will have
        same temperatures
        """

        search_1 = requests.post(
            f'{self.base_url}/searches/search/',
            json={'expression': 'empire state'},
            headers=self.headers
        )

        search_2 = requests.post(
            f'{self.base_url}/searches/search/',
            json={'expression': 'macys herald square'},
            headers=self.headers
        )

        data_1 = search_1.json()
        data_2 = search_2.json()

        self.assertTrue(search_1.ok)
        self.assertTrue(search_2.ok)
        self.assertIn('postal_code', data_1.get('address'))
        self.assertIn('postal_code', data_2.get('address'))
        self.assertIn('temperature', data_1.get('address'))
        self.assertIn('temperature', data_2.get('address'))
        self.assertEqual(
            data_1.get('address').get('postal_code'),
            data_2.get('address').get('postal_code')
        )
        self.assertEqual(
            data_1.get('address').get('temperature'),
            data_2.get('address').get('temperature')
        )

    def test_read_searches(self):
        """Tests if created searches are being retrieved correctly
        from the database.
        """

        response = requests.get(f'{self.base_url}/searches', headers=self.headers)
        searches = response.json()

        self.assertTrue(response.ok)

        for search in searches:
            self.assertIn('expression', search)
            self.assertIn('created_at', search)
            self.assertIn('address', search)
            self.assertIn('formatted_address', search.get('address'))
            self.assertIn('postal_code', search.get('address'))
            self.assertIn('city', search.get('address'))
            self.assertIn('state', search.get('address'))
            self.assertIn('country', search.get('address'))
            self.assertIn('temperature', search.get('address'))
            self.assertIn('updated_at', search.get('address'))
