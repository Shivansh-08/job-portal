import { Webhook } from "svix";
import User from "../models/User.js";

//api controller function to manage clerk user with database

export const clerkWebhooks = async (req, res) => {
    console.log("Full webhook payload:", JSON.stringify(req.body, null, 2));
      console.log("Webhook received", req.body.type);
      try{
        //create a svix webhook instance with clerk webhook secret
        const whook  = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        //verify the webhook signature
        try {
          await whook.verify(
              req.body,
              req.headers["svix-id"],
              req.headers["svix-timestamp"],
              req.headers["svix-signature"]
          );
          console.log("Webhook verification successful");
        } catch (verifyError) {
          console.error("Webhook verification failed:", verifyError);
          return res.status(400).json({ error: "Webhook verification failed" });
        }

        //getting data from request body
        const { data, type } = req.body;
        console.log("Processing webhook type:", type);
        console.log("Webhook data:", JSON.stringify(data));

        //switch case to handle different webhook events
        switch (type) {
            case "user.created": {
                //create a new user in the database
                const userData = {
                    _id:data.id,
                    name: data.firstName + " " + data.lastName,
                    email: data.emailAddresses[0].emailAddress,
                    image: data.image_url,
                    resume:''
                }
                console.log("Creating user with data:", userData);
                const newUser = await User.create(userData);
                console.log("User created successfully:", newUser._id);
                res.json({});
                break;
                } 
           

            case "user.updated":
                //update the user in the database
                await User.findByIdAndUpdate(data.id, {
                    name: data.firstName + " " + data.lastName,
                    email: data.emailAddresses[0].emailAddress,
                    image: data.image_url,
                });
                res.json({});
                break;

            case "user.deleted":
                //delete the user from the database
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;

            default:
                console.log("Unhandled event type:", type);
        }
      }
      catch(error){
         console.error("Error in clerk webhook handler:", error);
         res.status(500).json({success:false, message:"Error in clerk webhook handler"});
      }
      console.log("Full webhook payload:", JSON.stringify(req.body, null, 2));
}





