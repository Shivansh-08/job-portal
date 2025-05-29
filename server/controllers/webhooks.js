// webhooks.js
import { Webhook } from "svix";
import User from "../models/User.js";

// api controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body; // raw body buffer
    
    // Extract Svix headers - check multiple possible formats
    const headers = req.headers;
    const svix_id = headers["svix-id"] || headers["Svix-Id"];
    const svix_timestamp = headers["svix-timestamp"] || headers["Svix-Timestamp"];
    const svix_signature = headers["svix-signature"] || headers["Svix-Signature"];
    
    console.log("Webhook verification attempt:", {
      hasPayload: !!payload,
      payloadLength: payload ? payload.length : 0,
      payloadType: typeof payload,
      svix_id: svix_id,
      svix_timestamp: svix_timestamp,
      svix_signature: svix_signature ? "present" : "missing",
      webhookSecret: process.env.CLERK_WEBHOOK_SECRET ? "present" : "missing"
    });

    // Check if required headers are present
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing webhook headers:", {
        svix_id: !!svix_id,
        svix_timestamp: !!svix_timestamp,
        svix_signature: !!svix_signature
      });
      return res.status(400).json({ error: "Missing required webhook headers" });
    }

    // Check if webhook secret is configured
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    // Create a svix webhook instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    try {
      // Svix expects a string payload, not a buffer
      const payloadString = payload.toString();
      
      // Create headers object in the format Svix expects
      const svixHeaders = {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature
      };
      
      // Verify the webhook
      await whook.verify(payloadString, svixHeaders);
      console.log("Webhook verification successful");
    } catch (verifyError) {
      console.error("Webhook verification failed:", verifyError.message);
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    // Parse the payload
    const { data, type } = JSON.parse(payload.toString());
    console.log("Processing webhook type:", type);

    // Switch case to handle different webhook events
    switch (type) {
      case "user.created": {
        try {
          const userData = {
            _id: data.id,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User",
            email: data.email_addresses?.[0]?.email_address || "",
            image: data.image_url || "",
            resume: ""
          };
          console.log("Creating user with data:", userData);
          const newUser = await User.create(userData);
          console.log("User created successfully:", newUser._id);
        } catch (createError) {
          console.error("Error creating user:", createError);
          return res.status(500).json({ error: "Failed to create user" });
        }
        break;
      }

      case "user.updated": {
        try {
          await User.findByIdAndUpdate(data.id, {
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User",
            email: data.email_addresses?.[0]?.email_address || "",
            image: data.image_url || "",
          });
          console.log("User updated successfully:", data.id);
        } catch (updateError) {
          console.error("Error updating user:", updateError);
          return res.status(500).json({ error: "Failed to update user" });
        }
        break;
      }

      case "user.deleted": {
        try {
          await User.findByIdAndDelete(data.id);
          console.log("User deleted successfully:", data.id);
        } catch (deleteError) {
          console.error("Error deleting user:", deleteError);
          return res.status(500).json({ error: "Failed to delete user" });
        }
        break;
      }

      default:
        console.log("Unhandled event type:", type);
    }

    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error("Error in clerk webhook handler:", error);
    res.status(500).json({ success: false, message: "Error in clerk webhook handler" });
  }
};