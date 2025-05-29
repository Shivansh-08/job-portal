// server.js
import "./config/instrument.js";
import express from 'express';
import * as Sentry from "@sentry/node";
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkWebhooks } from "./controllers/webhooks.js";
import bodyParser from 'body-parser';

const app = express();

await connectDB();

// CORS middleware first
app.use(cors());

// Webhook route BEFORE express.json() to ensure raw body processing
app.post('/webhooks', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);

// Regular JSON middleware for other routes
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});