"""
CI/CD QUALITY GATE STEP — ci_gate.py
From Project Report Appendix 1 [6] and [7]
A pipeline step submits the changed prompt, waits for the gate result and fails the build when deployment is blocked.
"""

import os
import sys
import time
import requests

BASE = os.environ.get("PROMPT_HUB_URL", "http://localhost:8080")
API_KEY = os.environ.get("PROMPT_HUB_API_KEY", "aph_live_d71k9a82c41c21")
HEAD = {"Authorization": f"Bearer {API_KEY}"}


def main(prompt_id: str, path: str):
    if not os.path.exists(path):
        print(f"Error: Prompt file not found at {path}")
        sys.exit(1)

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"Submitting prompt change for Prompt ID: {prompt_id} from {path}...")
    try:
        r = requests.post(
            f"{BASE}/api/prompts/{prompt_id}/versions",
            headers=HEAD,
            json={"content": content, "changeInstruction": "CI submission"}
        )
        r.raise_for_status()
        version_data = r.json()
        version_id = version_data["id"]
        version_no = version_data.get("versionNo", "new")
        print(f"Version v{version_no} created (ID: {version_id}). Waiting for Quality Gate evaluation...")
    except requests.RequestException as e:
        print(f"Failed to submit prompt: {e}")
        sys.exit(1)

    while True:  # wait for the gate decision
        try:
            g = requests.get(f"{BASE}/api/versions/{version_id}/gate", headers=HEAD).json()
            if g.get("status") != "RUNNING":
                break
            print("Gate evaluation in progress...")
            time.sleep(2)
        except Exception as e:
            print(f"Error checking gate status: {e}")
            sys.exit(1)

    if g.get("passed"):
        print("Quality gate passed - deployment may proceed")
        print(f"Delta: {g.get('delta')}")
        sys.exit(0)
    else:
        reasons = "; ".join(g.get("reasons", ["Failed thresholds"]))
        print("Quality gate FAILED:", reasons)
        if g.get("recommendation"):
            print("Recommendation:", g.get("recommendation"))
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python ci_gate.py <PROMPT_ID> <PROMPT_FILE_PATH>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
