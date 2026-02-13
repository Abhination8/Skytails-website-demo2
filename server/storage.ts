
import { db } from "./db";
import {
  users, pets, financialProfiles, userProgress,
  type User, type InsertUser,
  type Pet, type InsertPet,
  type FinancialProfile, type InsertFinancialProfile,
  type UserProgress
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pets
  getPetsByUserId(userId: number): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet | undefined>;
  
  // Financial Profile
  getFinancialProfile(userId: number): Promise<FinancialProfile | undefined>;
  createFinancialProfile(profile: InsertFinancialProfile): Promise<FinancialProfile>;
  updateFinancialProfile(userId: number, profile: Partial<InsertFinancialProfile>): Promise<FinancialProfile | undefined>;
  
  // Progress
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  createUserProgress(userId: number): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Pets
  async getPetsByUserId(userId: number): Promise<Pet[]> {
    return await db.select().from(pets).where(eq(pets.userId, userId));
  }

  async createPet(pet: InsertPet): Promise<Pet> {
    const [newPet] = await db.insert(pets).values(pet).returning();
    return newPet;
  }

  async updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet | undefined> {
    const [updated] = await db.update(pets).set(pet).where(eq(pets.id, id)).returning();
    return updated;
  }

  // Financial Profile
  async getFinancialProfile(userId: number): Promise<FinancialProfile | undefined> {
    const [profile] = await db.select().from(financialProfiles).where(eq(financialProfiles.userId, userId));
    return profile;
  }

  async createFinancialProfile(profile: InsertFinancialProfile): Promise<FinancialProfile> {
    const [newProfile] = await db.insert(financialProfiles).values(profile).returning();
    return newProfile;
  }

  async updateFinancialProfile(userId: number, profile: Partial<InsertFinancialProfile>): Promise<FinancialProfile | undefined> {
    const [updated] = await db
      .update(financialProfiles)
      .set(profile)
      .where(eq(financialProfiles.userId, userId))
      .returning();
    return updated;
  }

  // Progress
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return progress;
  }

  async createUserProgress(userId: number): Promise<UserProgress> {
    const [newProgress] = await db
      .insert(userProgress)
      .values({ userId, profileCompletedPercent: 0, streakDays: 0 })
      .returning();
    return newProgress;
  }
}

export const storage = new DatabaseStorage();
