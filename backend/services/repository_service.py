from services.intent_service import detect_intent
from services.analysis_service import generate_analysis


def process_repository_query(
    repo_name: str,
    question: str
):
    """
    Main entry point for
    repository analysis.
    """

    intent = detect_intent(
        question
    )

    return generate_analysis(
        repo_name=repo_name,
        question=question,
        intent=intent
    )