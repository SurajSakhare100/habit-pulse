import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ error: "Please verify your email before signing in." }, { status: 403 });
        }

        const isValid = await bcrypt.compare(password, user.password || "");

        if (!isValid) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }
        // Set cookie
        cookies().set('user_token', user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ message: 'Signed in successfully' });

    } catch (error) {
        console.error("Sign-in error:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
