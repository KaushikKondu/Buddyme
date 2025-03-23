import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  provider: text("provider"),
  providerId: text("provider_id"),
  interests: jsonb("interests").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  interest: text("interest").notNull(),
});

export const userConnections = pgTable("user_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  connectedUserId: integer("connected_user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  displayName: true,
  photoURL: true,
  provider: true,
  providerId: true,
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUserSchema = loginUserSchema.extend({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type User = typeof users.$inferSelect;
