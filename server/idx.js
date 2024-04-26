import express from "express";
import cors from 'cors';
import Stripe from 'stripe';




const app = express();
const PUBLISHABLE_KEY = "pk_test_51P9UmWAlnVITPMWk3Kl5vzD7tT6sW5ssVCr5hodGm4qXVJIPYsujWr0SrZ4f4URiHLcsgSluzsmCxMbXXxeWjzdJ00FvevaEWW";
const SECRET_KEY = "sk_test_51P9UmWAlnVITPMWkYbcqdDMJcVhSdWSDHGSNndzLtDTd6ZzTngEyubT4quun1jbbWrw3E92lRvtqwpbPW8V6GYBD000v7GnCdi";

const stripe = Stripe(SECRET_KEY, {apiVersion: "2024-04-10"})
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Thrifti listening at http://143.215.94.26:3000${port}`);
});


app.post("/create-payment-intent", async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create
        ({
                amount: 100, //this is in cents and each boost is $1
                currency: "usd",
                payment_method_types: ["card"],
            });
        const clientSecret = paymentIntent.client_secret;
        res.json({
            clientSecret: clientSecret,
        });
    } catch (e) {
        console.log(e.message);
        res.json({error: e.message})
    }
});


