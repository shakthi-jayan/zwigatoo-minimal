// Firebase Migration - Convex schema replaced with Firebase Firestore
// User roles for Firebase authentication and authorization
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  STAFF: "staff",
} as const;

export type Role = keyof typeof ROLES;

// Firestore collections are defined in firestore-service.ts
// This file is kept for reference only
