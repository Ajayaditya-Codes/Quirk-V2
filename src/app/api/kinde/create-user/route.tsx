import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";

const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
  try {
    // Read the incoming JWT token
    const token = await req.text();

    // Decode the token and validate its structure
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken || !decodedToken.header || !decodedToken.payload) {
      throw new Error("Invalid token structure");
    }

    const { header } = decodedToken as jwt.Jwt;
    const { kid } = header;

    // Get the signing key from JWKS
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    // Verify the token with the signing key
    const event = jwt.verify(token, signingKey);

    // Ensure the event type is 'user.created'
    if ((event as jwt.JwtPayload)?.type === "user.created") {
      const user = (event as jwt.JwtPayload)?.data?.user;

      // Ensure the user object exists
      if (user && user.id && user.first_name && user.email) {
        try {
          // Insert the user into the database
          await db
            .insert(Users)
            .values({
              KindeID: user.id,
              Username: user.first_name,
              Email: user.email,
              Credits: 20,
            })
            .execute();
        } catch (error: any) {
          console.error("Error inserting user:", error);
          return NextResponse.json(
            { message: "Failed to insert user into the database", error: error.message },
            { status: 500 }
          );
        }
      } else {
        throw new Error("Invalid user data in the event payload");
      }
    }

  } catch (err) {
    // Catch and log any error during the process
    console.error("Error processing request:", err);
    return NextResponse.json(
      { message: "Error processing the request", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 }
    );
  }

  // Return success response
  return NextResponse.json({ status: 200, statusText: "success" });
}
