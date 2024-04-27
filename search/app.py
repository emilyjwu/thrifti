import os
from openai import OpenAI
from pinecone import Pinecone
import stripe
from flask import Flask, render_template, request, jsonify


pc = Pinecone(api_key=os.environ.get('PINECONE_API_KEY'))
index = pc.Index("thrifti-bins")

client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

stripe.api_key = os.environ.get('STRIPE_API_KEY')

# pylint: disable=C0103
app = Flask(__name__)

@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    message = "It's running!"

    """Get Cloud Run environment variables."""
    service = os.environ.get('K_SERVICE', 'Unknown service')
    revision = os.environ.get('K_REVISION', 'Unknown revision')

    return render_template('index.html',
        message=message,
        Service=service,
        Revision=revision)

def vectorize(listing_labels):
    stringified_labels = " ".join(listing_labels)
    return client.embeddings.create(
        input=stringified_labels,
        model="text-embedding-3-small"
    ).data[0].embedding

@app.route("/upsert", methods=['POST'])
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
        return ("Issue Upserting" + str(e))

@app.route("/search", methods=['GET'])
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
        return ("Search Failed" + str(e))

@app.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=100,  # this is in cents and each boost is $1
            currency="usd",
            payment_method_types=["card"],
        )
        client_secret = payment_intent.client_secret
        return jsonify({"clientSecret": client_secret})
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    server_port = os.environ.get('PORT', '8080')
    app.run(debug=False, port=server_port, host='0.0.0.0')
