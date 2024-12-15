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
    const token = await req.text();

    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      throw new Error("Invalid token");
    }
    const { header } = decodedToken as jwt.Jwt;
    const { kid } = header;

    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = await jwt.verify(token, signingKey);

    switch ((event as jwt.JwtPayload)?.type) {
      case "user.created":
        const user = (event as jwt.JwtPayload)?.data?.user;
        try {
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
          console.error(error);
          return NextResponse.json({ message: error }, { status: 400 });
        }

        break;
      default:
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ status: 200, statusText: "success" });
}
