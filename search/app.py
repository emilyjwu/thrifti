from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from flask import Flask, jsonify, request, render_template
import os

pc = Pinecone(api_key=os.environ.get('PINECONE_API_KEY'))
index = pc.Index("thrifti-bins")

client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8000)

@app.route('/')
def connect():
    return """<!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to Search</title>
    </head>
    <body>
        <h1>Functions</h1>
        <h2>/upsert-pinecone</h2>
        <p>takes: listing_labels: list of strings; 
                listing_id: listing ID in firebase; 
                date: current date
        <h2>/search-k</h2>
        <p>takes: search_string: string to search on; 
                    k: number of results to return
        <h1>Have fun!</h1>
    </body>
    </html>"""

def vectorize(listing_labels):
    stringified_labels = " ".join(listing_labels)
    return client.embeddings.create(
        input=stringified_labels,
        model="text-embedding-3-small"
    ).data[0].embedding

@app.post("/upsert-pinecone")
def upsert_pinecone():
    # PARAMS
    listing_labels = request.args["listing_labels"]
    listing_id = request.args["listing_id"]
    date = request.args["date"]

    try:
        listing_embedding = vectorize(listing_labels)
        print("aight")
        index.upsert(
            vectors=[
                {"id": listing_id, "values": listing_embedding, "metadata": {date: date}},
            ],
            namespace="thrifti_listings"
        )
        return "Successful Upsert"
    except Exception as e:
        print(e)
        return "Issue Upserting"

@app.get("/search-k")
def search_k():
    # PARAMS
    search_string = request.args['search_string']
    k = request.args['k']
    print(str(k) + str(search_string))
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