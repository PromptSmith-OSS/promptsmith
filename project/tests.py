from django.test import TestCase
from .utils import generate_token, decode_token, generate_secure_token
from uuid import UUID


class TestUtils(TestCase):

    def test_generate_token(self):
        token = generate_token('user_uuid', 'project_uuid')
        self.assertTrue(token)


    def test_decode_token(self):
        token = generate_token('user_uuid', 'project_uuid')
        decoded = decode_token(token)
        self.assertEqual(decoded['user_uuid'], 'user_uuid')
        self.assertEqual(decoded['project_uuid'], 'project_uuid')

    def test_generate_secure_token(self):
        token = generate_secure_token()
        self.assertTrue(token)
        self.assertEqual(len(token), 64)