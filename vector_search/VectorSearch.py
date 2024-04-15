from pinecone import Pinecone
from openai import OpenAI
from flask import Flask, jsonify, request
import os

pc = Pinecone(api_key=
    ""
)
index = pc.Index("thrifti-bins")

client = OpenAI()

app = Flask("Pinecone")

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8000)))

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

def vectorize(listing_labels):
    stringified_labels = " ".join(listing_labels)
    return client.embeddings.create(
        input=stringified_labels,
        model="text-embedding-3-small"
    ).data[0].embedding

@app.post("/upsert-pinecone")
def upsert_pinecone():
    listing_labels = request.args["listing_labels"]
    listing_id = request.args["listing_id"]
    metadata = request.args["metadata"]
    try:
        listing_embedding = vectorize(listing_labels)
        index.upsert(
            vectors=[
                {"id": listing_id, "values": listing_embedding, "metadata": metadata},
            ],
            namespace="thrifti_listings"
        )
        return "Successful Upsert"
    except:
        return "Issue Upserting"

@app.get("/search-k")
def search_k_nearest():
    search_string = request.args['search_string']
    k = request.args['k']
    search_vec = vectorize(search_string)
    try:
        query_response = index.query(
            namespace="thrifti_listings",
            vector=search_vec,
            top_k=int(k),
            include_values=False
        )
        search_matches = [
        {'id': match['id'], 'score': match['score']}
            for match in query_response.matches
        ]
        return jsonify(matches=search_matches)
    except Exception as e:
        print(e)
        return "Search Failed"