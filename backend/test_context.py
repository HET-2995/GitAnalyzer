from services.context_builder import build_context

result = build_context(
    repo_name="SigmaGPT",
    intent="DOCUMENTATION",
    question="Generate complete documentation"
)

print(result["context"])

print("\n\n================ SOURCES ================\n")

for source in result["sources"]:
    print(source)