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
            name: "login",
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

                    if (!user) {
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
            name: "signup",
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
    },

    callbacks: {
        async jwt(token, user, account) {
            if (user) {
                token.accessToken = user.access_token;
                token.id = account.id;
            }
            return token;
        },

        async session(token, session, user) {
            session.accessToken = token.accessToken;
            session.user.id = token.id;
            return session;
        },

        async login({ email, password, credentials }) {
            const isAllowedToLogin = true;
            if (isAllowedToLogin) {
                return true;
            }
            else {
                return false;
            }
        },

        async signup({ firstName, lastName, company, email, password, credentials}) {
            const isAllowedToSignUp = true;
            if(isAllowedToSignUp) {
                return true;
            }
            else {
                return false;
            }
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };