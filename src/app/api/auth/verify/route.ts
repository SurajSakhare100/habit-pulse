import dbConnect from "@/lib/db";
import User from "@/models/User";
import VerifyToken from "@/models/VerifyToken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token missing." }, { status: 400 });
    }

    await dbConnect();

    const verifyToken = await VerifyToken.findOne({ token });

    if (!verifyToken || verifyToken.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    // Update user's verification status
    await User.findByIdAndUpdate(verifyToken.userId, {
      emailVerified: new Date(),
      isVerified: true,
    });

    await VerifyToken.deleteOne({ _id: verifyToken._id });

    const redirectUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return NextResponse.redirect(`${redirectUrl}/auth/signin?verified=true`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
