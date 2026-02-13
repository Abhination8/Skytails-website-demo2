
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// User table for minimal auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Will store plain text/simple hash for prototype
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pet details
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users
  name: text("name").notNull(),
  breed: text("breed"),
  age: integer("age"), // in months
  weight: integer("weight"), // in grams or oz, just a number for now
  imageUrl: text("image_url"),
  healthNotes: text("health_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial/Investment details (Mock data structure)
export const financialProfiles = pgTable("financial_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  monthlyContribution: integer("monthly_contribution").default(0),
  riskLevel: text("risk_level").default("moderate"), // conservative, moderate, aggressive
  goalTimeline: integer("goal_timeline").default(5), // years
  kycStatus: text("kyc_status").default("pending"), // pending, verified
  planTier: text("plan_tier").default("classic"), // classic, core, premium
  totalSavings: integer("total_savings").default(0),
});

// Engagement/Gamification
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  profileCompletedPercent: integer("profile_completed_percent").default(0),
  streakDays: integer("streak_days").default(0),
  lastLoginDate: timestamp("last_login_date"),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPetSchema = createInsertSchema(pets).omit({ id: true, createdAt: true });
export const insertFinancialProfileSchema = createInsertSchema(financialProfiles).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, lastLoginDate: true });

// === EXPLICIT API TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;

export type FinancialProfile = typeof financialProfiles.$inferSelect;
export type InsertFinancialProfile = z.infer<typeof insertFinancialProfileSchema>;

export type UserProgress = typeof userProgress.$inferSelect;

// Request types
export type CreateUserRequest = InsertUser & { petName?: string }; // Signup with optional pet name
export type CreatePetRequest = InsertPet;
export type UpdatePetRequest = Partial<InsertPet>;
export type UpdateFinancialProfileRequest = Partial<InsertFinancialProfile>;

// Response types
export type AuthResponse = { user: User; token?: string }; // Simple mock auth response
export type DashboardDataResponse = {
  user: User;
  pets: Pet[];
  financialProfile: FinancialProfile;
  progress: UserProgress;
};
