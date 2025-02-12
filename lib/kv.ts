import { type FrameNotificationDetails } from "@farcaster/frame-sdk";
import { ref, get, set, remove } from "firebase/database";
import { db } from "./firebase";

// Extended type that includes subdomain
type StoredNotificationDetails = FrameNotificationDetails & {
  subdomain?: string;
};

function getUserNotificationDetailsKey(fid: number): string {
  return `compusophy/users/${fid}/notifications`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<StoredNotificationDetails | null> {
  const snapshot = await get(ref(db, getUserNotificationDetailsKey(fid)));
  return snapshot.val() as StoredNotificationDetails | null;
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails,
  subdomain?: string
): Promise<void> {
  await set(ref(db, getUserNotificationDetailsKey(fid)), {
    ...notificationDetails,
    subdomain
  });
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  await remove(ref(db, getUserNotificationDetailsKey(fid)));
}
