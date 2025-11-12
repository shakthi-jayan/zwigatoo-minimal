// Firebase Migration - Convex schema replaced with Firebase Firestore
// This file exports an empty schema to satisfy Convex deployment requirements
import { defineSchema } from "convex/server";

// User roles for Firebase authentication and authorization
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  STAFF: "staff",
} as const;

export type Role = keyof typeof ROLES;

// Firestore collections are defined in firestore-service.ts
// Exporting empty schema as the project uses Firebase instead of Convex
export default defineSchema({});
