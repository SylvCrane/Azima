/* Dynamic routes can be extended to catch all paths by adding three dots ('...') inside the brackets */

import NextAuth, {NextAuthOptions} from "next-auth";

const authOptions = {

    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                email: { input: "email", type: "text", placeholder: "email@gmail.com"},
                password: {input: "password", type: "password"}
            },
            
            async authorize(credentials, req) {
                
            }
        }),
    ],
};

export default NextAuth(authOptions);