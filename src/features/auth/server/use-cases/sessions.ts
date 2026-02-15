import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./location";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from "@/config/constant";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

type CreateSessionData = {
  userAgent: string;
  ip: string;
  userId: mongoose.Types.ObjectId;
  token: string;
};

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex").normalize();
};

// generates a 256-bit cryptographically secure token
// <Buffer 4f 8a 9b 12 ... > (raw binary, not readable)
// Converts that binary data into a hexadecimal string.("4f8a9b12d1e9a8c3f5...")
// This ensures the string is in a consistent Unicode normalization form (usually NFC).

const createUserSession = async ({
  token,
  userId,
  userAgent,
  ip,
}: CreateSessionData) => {
  const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

  await connectDB();
  const session = await Session.create({
    _id: hashedToken,
    userId,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
    ip,
    userAgent,
  });

  return session;
};

export const createSessionAndSetCookies = async (
  userId: mongoose.Types.ObjectId
) => {
  const token = generateSessionToken();
  const ip = await getIPAddress();
  const headersList = await headers();

  await createUserSession({
    token,
    userId: userId,
    userAgent: headersList.get("user-agent") || "",
    ip: ip,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    secure: true,
    httpOnly: true,
    maxAge: SESSION_LIFETIME,
  });
};

export const validateSessionAndGetUser = async (session: string) => {
  const hashedToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  await connectDB();
  
  // Explicitly reference User model to ensure it's registered
  User;
  
  const sessionDoc = await Session.findById(hashedToken).populate({
    path: 'userId',
    model: User
  }).lean();

  if (!sessionDoc) return null;

  const user = sessionDoc.userId as any;

  if (!user) return null;

  // Check if session expired
  if (Date.now() >= new Date(sessionDoc.expiresAt).getTime()) {
    await invalidateSession(sessionDoc._id);
    return null;
  }

  // Refresh session if needed
  if (
    Date.now() >=
    new Date(sessionDoc.expiresAt).getTime() - SESSION_REFRESH_TIME * 1000
  ) {
    await Session.findByIdAndUpdate(sessionDoc._id, {
      expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
    });
  }

  return {
    id: user._id.toString(),
    session: {
      id: sessionDoc._id.toString(),
      expiresAt: sessionDoc.expiresAt,
      userAgent: sessionDoc.userAgent,
      ip: sessionDoc.ip,
    },
    name: user.name,
    userName: user.userName,
    role: user.role,
    phoneNumber: user.phoneNumber,
    email: user.email,
    avatarUrl: user.avatarUrl,
    deletedAt: user.deletedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const invalidateSession = async (id: string) => {
  await connectDB();
  await Session.findByIdAndDelete(id);
};
