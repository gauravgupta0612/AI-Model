from flask import Flask, request, jsonify
from transformers import RobertaTokenizer, RobertaModel
import torch
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Initialize tokenizer and model
tokenizer = RobertaTokenizer.from_pretrained("microsoft/codebert-base")
model = RobertaModel.from_pretrained("microsoft/codebert-base")

# Sample code snippets (small dataset)
code_snippets = [
    "def add(a, b): return a + b",
    "def sum(x, y): return x + y",
    "def multiply(a, b): return a * b",
    "def subtract(a, b): return a - b"
]

# Function to generate embedding for code
def get_embedding(code):
    tokens = tokenizer(code, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**tokens)
    return outputs.last_hidden_state.mean(dim=1).numpy()

# Precompute embeddings for the dataset
embeddings = [get_embedding(snippet) for snippet in code_snippets]

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    source_code = data.get('source', '')

    if not source_code:
        return jsonify({"error": "Source code is required."}), 400

    # Generate embedding for the query
    query_embedding = get_embedding(source_code)

    # Compare query with dataset using cosine similarity
    similarities = [cosine_similarity(query_embedding, emb)[0][0] for emb in embeddings]

    # Find the most similar snippet
    most_similar_index = similarities.index(max(similarities))
    similarity_range = f"{min(similarities):.2f} - {max(similarities):.2f}"

    return jsonify({
        "similarityRange": similarity_range,
        "mostSimilarCode": code_snippets[most_similar_index]
    })

if __name__ == '__main__':
    app.run(debug=True)
