// webhooks.js
import { Webhook } from "svix";
import User from "../models/User.js";

// api controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body; // raw body buffer
    
    // Extract Svix headers (they're in lowercase as shown in the logs)
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    // Check if required headers are present
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing webhook headers:", {
        svix_id: !!svix_id,
        svix_timestamp: !!svix_timestamp,
        svix_signature: !!svix_signature
      });
      return res.status(400).json({ error: "Missing required webhook headers" });
    }

    // Create a svix webhook instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    try {
      // Pass headers as separate parameters (the correct Svix way)
      await whook.verify(payload, svix_id, svix_timestamp, svix_signature);
      console.log("Webhook verification successful");
    } catch (verifyError) {
      console.error("Webhook verification failed:", verifyError);
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    // Parse the payload manually since it's a buffer
    const { data, type } = JSON.parse(payload.toString());
    console.log("Processing webhook type:", type);
    console.log("Webhook data:", JSON.stringify(data));

    // Switch case to handle different webhook events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          name: data.firstName + " " + data.lastName,
          email: data.emailAddresses[0].emailAddress,
          image: data.image_url,
          resume: ""
        };
        console.log("Creating user with data:", userData);
        const newUser = await User.create(userData);
        console.log("User created successfully:", newUser._id);
        res.json({});
        break;
      }

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          name: data.firstName + " " + data.lastName,
          email: data.emailAddresses[0].emailAddress,
          image: data.image_url,
        });
        res.json({});
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;

      default:
        console.log("Unhandled event type:", type);
        res.status(200).json({});
    }
  } catch (error) {
    console.error("Error in clerk webhook handler:", error);
    res.status(500).json({ success: false, message: "Error in clerk webhook handler" });
  }
};