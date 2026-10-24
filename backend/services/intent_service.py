from services.llm_service import llm
from dotenv import load_dotenv
load_dotenv()

from services.llm_service import llm
from dotenv import load_dotenv

load_dotenv()


def detect_intent(question: str):

    prompt = f"""
You are an intent classifier for a GitHub Repository Analyzer.

Possible intents are:

QA
SUMMARY
ARCHITECTURE
BUG_ANALYSIS
IMPROVEMENTS
DOCUMENTATION

Definitions:

QA:
Questions about implementation details,
functions,
classes,
APIs,
database models,
business logic,
algorithms,
or workflows.

SUMMARY:
The user wants a high-level overview of the repository,
including project purpose,
tech stack,
main features,
or overall functionality.

ARCHITECTURE:
The user asks about system design,
folder structure,
modules,
component interactions,
request flow,
data flow,
or overall architecture.

BUG_ANALYSIS:
The user wants to identify bugs,
security vulnerabilities,
code smells,
logic errors,
edge cases,
or potential issues.

IMPROVEMENTS:
The user asks for optimizations,
refactoring suggestions,
performance improvements,
maintainability improvements,
or best practices.

DOCUMENTATION:
The user wants documentation generated from the repository.

Examples include:
- Generate documentation
- Create API documentation
- Generate developer documentation
- Document this repository
- Create project documentation
- Write README
- Generate technical documentation
- Explain every module as documentation

Rules:

- Return ONLY one intent.
- Return ONLY one of these values:

QA
SUMMARY
ARCHITECTURE
BUG_ANALYSIS
IMPROVEMENTS
DOCUMENTATION

Question:
{question}
"""

    response = llm.invoke(prompt)

    intent = response.content.strip().upper()
    valid_intents = {"QA", "SUMMARY", "ARCHITECTURE", "BUG_ANALYSIS", "IMPROVEMENTS", "DOCUMENTATION"}
    if intent not in valid_intents:
        return "QA"
    return intent

