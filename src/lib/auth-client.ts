import { config } from "dotenv";
import { createAuthClient } from "better-auth/react"

config({ path: ".env" });

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL
})