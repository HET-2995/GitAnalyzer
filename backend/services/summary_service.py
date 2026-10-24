import os 
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from services.context_builder import build_context
load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)



def generate_summary(repo_name):
    context_data = build_context(
        repo_name=repo_name,
        intent="SUMMARY",
        question="Summarize repository purpose, architecture, and tech stack"
    )
    context = context_data["context"]

    prompt = f"""
You are a senior software architect.

Analyze this repository.

Generate:

1. Project Purpose

2. Tech Stack

3. Main Features

4. Important Modules

5. High Level Architecture

Repository Content:

{context}
"""
    response = llm.invoke(
    prompt
)
    return response.content