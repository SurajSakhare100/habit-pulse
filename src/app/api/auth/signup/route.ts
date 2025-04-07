import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import VerifyToken from "@/models/VerifyToken";
import { resend } from "@/lib/resend";
import { getVerifyEmailTemplate } from "@/lib/email/verifyTemplate";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      emailVerified: null,
      authProvider: 'email',
    });
    

    const token = crypto.randomBytes(32).toString("hex");

    await VerifyToken.deleteMany({ userId: user._id }); // cleanup previous
    await VerifyToken.create({
      userId: user._id,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify?token=${token}`;
    const html = getVerifyEmailTemplate({ name, verifyUrl });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your HabitPulse account",
      html,
    });

    return NextResponse.json({ message: "Signup successful, check your email to verify." });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
