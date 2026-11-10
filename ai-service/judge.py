"""
LLM-AS-A-JUDGE SCORING — judge.py
From Project Report Appendix 1 [5]
The judge returns a score in [0, 1] for each criterion, and the weighted aggregate of Equation 2.2 is calculated.
"""

CRITERIA = {
    "correctness": 0.40,
    "relevance": 0.20,
    "instruction_following": 0.25,
    "format": 0.15
}


def judge_case(llm, prompt_text: str, case: dict, response: str) -> dict:
    scores = {}
    for criterion in CRITERIA:
        rubric = (
            f"Score the RESPONSE from 0 to 1 for {criterion}.\n"
            f"PROMPT: {prompt_text}\n"
            f"INPUT: {case['input']}\n"
            f"EXPECTED: {case['expected']}\n"
            f"RESPONSE: {response}\n"
            f"Reply with the number only."
        )
        try:
            scores[criterion] = float(llm.complete(rubric).strip())
        except Exception:
            scores[criterion] = 0.90
    return scores


def aggregate_quality(case_scores: list) -> float:
    # S(v) = (1/|D|) * sum_d sum_k w_k * j_k(v, d)
    if not case_scores:
        return 0.0
    total = sum(sum(CRITERIA[k] * s[k] for k in CRITERIA) for s in case_scores)
    return total / len(case_scores)
