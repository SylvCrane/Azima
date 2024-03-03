/* Dynamic routes can be extended to catch all paths by adding three dots ('...') inside the brackets */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../config/db";
import UserDetails from "../../../models/UserDetails";
import bcrypt from "bcryptjs";

// Object to hold the providers
const authOptions = {
    providers: [
        // LOGIN CREDENTIALS
        CredentialsProvider({
            type: "credentials",
            id: "login",
            credentials: {
                email: { label: "Email", input: "email", type: "text", placeholder: "email@gmail.com" },
                password: { label: "Password", input: "password", type: "password" }
            },
            
            // Function to authorise the credentials
            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    await connectDB();
                    // After find users email in db
                    const user = await UserDetails.findOne({ email });

                    if (!UserDetails) {
                        console.log("User not found in db");
                        return null; 
                    }
                    /* else if email is found use bcrypt function to check whether password input
                    matches the password saved in mongodb */
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (!passwordMatch) {
                        console.log("Incorrect password");
                        return null;
                    }
                    
                    return user;

                } catch (error) {
                    console.log(error);
                }
                
            }
        }),

        // SIGN UP CREDENTIALS 
        CredentialsProvider({
            type:"credentials",
            id:"signup",
            credentials: {
                firstName: { label: "First Name", input: "text", type: "text", placeholder: "First Name"},
                lastName: { label: "Last Name", input: "text", type: "text", placeholder: "Last Name"},
                company: { label: "Company", input: "text", type: "text", placeholder: "Company"},
                email: { label: "Email", input: "email", type: "text", placeholder: "email@gmail.com" },
                password: { label: "Password", input: "password", type: "password" }
            }, 

            // Function to authorize credentials 
            async authorize(credentials) {
                const { firstName, lastName, company, email, password } = credentials;

                try {
                    await connectDB();
                    // First check if user exists in mongo db
                    const userExists = await UserDetails.findOne({ email });
                    if (userExists) {
                        console.log("Email is already registered");
                        return null;
                    }

                    // If user doesn't exist create new user and ensure their password is encrypted.
                    const encryptedPassword = await bcrypt.hash(password, 10);
                    const newUser = new UserDetails({
                        firstName, 
                        lastName, 
                        company,
                        email, 
                        password: encryptedPassword
                    });

                    await newUser.save();

                    return newUser;

                } catch (error) {
                    console.log(error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    
    secret: process.env.NEXTAUTH_SECRET,
    peages: {
        account: "/"
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };