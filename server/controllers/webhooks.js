import { Webhook } from "svix";
import User from "../models/User.js";

//api controller function to manage clerk user with database

export const clerkWebhooks = async (req, res) => {
      try{
        //create a svix webhook instance with clerk webhook secret
        const whook  = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        //verify the webhook signature
        await whook.verify(
            req.body,
            req.headers["svix-id"],
            req.headers["svix-timestamp"],
            req.headers["svix-signature"]
        );

        //getting data from request body
        const { data, type } = req.body;

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
                await User.create(userData);
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
      catch{
         console.log("Error in clerk webhook handler");
         res.json({success:false, message:"Error in clerk webhook handler"});
      }

}


