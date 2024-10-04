import requests
from typing import Optional, Dict, Any
from .interfaces import PromptResponse


class PromptSmith():

    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.api_key = api_key

    def get_prompt(self, unique_key: str) -> Optional[PromptResponse]:
        url = f"{self.base_url}/prompt/{unique_key}"
        headers = {
            "Authorization": f"{self.api_key}",
            "Content-Type": "application/json",
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        return None
