import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    // Handle authentication
    const authResponse = await handleAuth()(req, res);

    // Additional logic after authentication if needed
    if (!authResponse.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Continue with the API logic if authenticated
    return NextResponse.json({ message: "User is authenticated" });
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
};
