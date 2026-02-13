
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === AUTH ROUTES (MOCK SESSION) ===
  // For this prototype, we'll store userId in a simple session-like manner or just rely on client-side state for the "fast signup" feel
  // But to be proper, let's use a simple mock session approach if needed, or just return the user object and let frontend handle context.
  
  app.post(api.auth.signup.path, async (req, res) => {
    try {
      const input = api.auth.signup.input.parse(req.body);
      
      // Check existing
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Create User
      const user = await storage.createUser({
        email: input.email,
        password: input.password,
        name: input.email.split('@')[0], // Default name from email
      });

      // Initialize defaults
      await storage.createFinancialProfile({ userId: user.id, monthlyContribution: 50 });
      await storage.createUserProgress(user.id);
      
      if (input.petName) {
        await storage.createPet({
          userId: user.id,
          name: input.petName,
          breed: "Unknown Mixed",
          age: 12, // 1 year default
          weight: 0,
          imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=500", // Default pup
        });
      }

      // Mock login by returning user
      // In a real app, set session here
      req.session.userId = user.id; // Using express-session if available, or just mock

      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json(user);
  });

  // === DASHBOARD ROUTE ===
  app.get(api.dashboard.get.path, async (req, res) => {
    if (!req.session.userId) {
      // Return mock data for demo if not logged in? Or 401?
      // Let's return 401 to force auth flow usage
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.session.userId;
    const user = await storage.getUser(userId);
    const pets = await storage.getPetsByUserId(userId);
    const financialProfile = await storage.getFinancialProfile(userId);
    const progress = await storage.getUserProgress(userId);

    if (!user || !financialProfile || !progress) {
       return res.status(404).json({ message: "Data incomplete" });
    }

    res.json({
      user,
      pets,
      financialProfile,
      progress
    });
  });

  // === PETS ROUTES ===
  app.post(api.pets.create.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.pets.create.input.parse(req.body);
      // Ensure userId matches session
      if (input.userId !== req.session.userId) {
         // Force overwrite or error? Let's overwrite for safety
         input.userId = req.session.userId;
      }
      
      const pet = await storage.createPet(input);
      res.status(201).json(pet);
    } catch (err) {
       res.status(400).json({ message: "Validation error" });
    }
  });

  app.put(api.pets.update.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    
    // Verify ownership... simplified for prototype
    const petId = parseInt(req.params.id);
    const updated = await storage.updatePet(petId, req.body);
    if (!updated) return res.status(404).json({ message: "Pet not found" });
    res.json(updated);
  });

  // === FINANCIAL ROUTES ===
  app.put(api.financials.update.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    
    const updated = await storage.updateFinancialProfile(req.session.userId, req.body);
    res.json(updated);
  });
  
  // Seed data function to ensure at least one demo user exists
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUser = await storage.getUserByEmail("demo@skytails.com");
  if (!existingUser) {
    const user = await storage.createUser({
      email: "demo@skytails.com",
      password: "demo",
      name: "Demo User",
    });
    
    await storage.createFinancialProfile({
      userId: user.id,
      monthlyContribution: 100,
      riskLevel: "aggressive",
      totalSavings: 1250,
      goalTimeline: 10
    });
    
    await storage.createPet({
      userId: user.id,
      name: "Luna",
      breed: "Golden Retriever",
      age: 24,
      weight: 28000,
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
      healthNotes: "All vaccinations up to date. Loves swimming."
    });

    await storage.createUserProgress(user.id);
    
    console.log("Database seeded with demo user");
  }
}
