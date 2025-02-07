import { type FrameNotificationDetails } from "@farcaster/frame-sdk";
import { ref, get, set, remove } from "firebase/database";
import { db } from "../lib/firebase";

// Simple in-memory storage for demo
const userNotificationStore = new Map();

function getUserNotificationDetailsKey(fid: number): string {
  return `compusophy/users/${fid}/notifications`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<FrameNotificationDetails | null> {
  const snapshot = await get(ref(db, getUserNotificationDetailsKey(fid)));
  return snapshot.val() as FrameNotificationDetails | null;
}

export async function setUserNotificationDetails(fid: number, details: any) {
  userNotificationStore.set(fid, details);
}

export async function deleteUserNotificationDetails(fid: number) {
  userNotificationStore.delete(fid);
}
