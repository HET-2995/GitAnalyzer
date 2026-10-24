from services.context_builder import build_context
from services.llm_service import llm

from prompts.analysis_prompts import (
    SUMMARY_PROMPT,
    ARCHITECTURE_PROMPT,
    BUG_PROMPT,
    IMPROVEMENT_PROMPT,
    DOCUMENTATION_PROMPT,
    QA_PROMPT
)


PROMPTS = {

    "QA": QA_PROMPT,

    "SUMMARY": SUMMARY_PROMPT,

    "ARCHITECTURE": ARCHITECTURE_PROMPT,

    "BUG_ANALYSIS": BUG_PROMPT,

    "IMPROVEMENTS": IMPROVEMENT_PROMPT,

    "DOCUMENTATION": DOCUMENTATION_PROMPT
}


def build_prompt(
    intent: str,
    context: str,
    question: str
):
    

    prompt_template = PROMPTS.get(intent)

    if prompt_template is None:
        raise ValueError(
            f"Unsupported intent: {intent}"
        )

    return f"""
{prompt_template}

==================================================
REPOSITORY CONTEXT
==================================================

{context}

==================================================
USER QUESTION
==================================================

{question}

==================================================
ANSWER
==================================================
"""


def generate_analysis(
    repo_name: str,
    question: str,
    intent: str
):
    """
    Complete analysis pipeline.

    Repository
        ↓
    Context
        ↓
    Prompt
        ↓
    LLM
    """

    context_data= build_context(
        repo_name,
        intent,
        question
    )

    context = context_data["context"]

    sources = context_data["sources"]           

    prompt = build_prompt(
        intent,
        context,
        question
    )

    response = llm.invoke(prompt)

    return {

    "intent": intent,

    "answer": response.content,

    "sources": sources
}