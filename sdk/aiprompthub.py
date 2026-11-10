"""
AI Prompt Hub - Python SDK
Provides easy programmatic access for AI applications and CI/CD automation pipelines.
"""

import requests
from typing import Optional, Dict, Any, List


class AIPromptHubClient:
    def __init__(self, api_key: str, base_url: str = "http://localhost:8080"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })

    def list_prompts(self) -> List[Dict[str, Any]]:
        res = self.session.get(f"{self.base_url}/api/prompts")
        res.raise_for_status()
        return res.json()

    def get_prompt(self, prompt_id: str) -> Dict[str, Any]:
        res = self.session.get(f"{self.base_url}/api/prompts/{prompt_id}")
        res.raise_for_status()
        return res.json()

    def submit_version(self, prompt_id: str, content: str, change_instruction: str) -> Dict[str, Any]:
        res = self.session.post(
            f"{self.base_url}/api/prompts/{prompt_id}/versions",
            json={"content": content, "changeInstruction": change_instruction}
        )
        res.raise_for_status()
        return res.json()

    def get_gate_decision(self, version_id: str) -> Dict[str, Any]:
        res = self.session.get(f"{self.base_url}/api/versions/{version_id}/gate")
        res.raise_for_status()
        return res.json()

    def rollback(self, prompt_id: str, target_version_no: int) -> Dict[str, Any]:
        res = self.session.post(
            f"{self.base_url}/api/prompts/{prompt_id}/rollback",
            json={"targetVersionNo": target_version_no}
        )
        res.raise_for_status()
        return res.json()

    def semantic_search(self, query: str) -> List[Dict[str, Any]]:
        res = self.session.get(f"{self.base_url}/api/semantic-search", params={"query": query})
        res.raise_for_status()
        return res.json()
