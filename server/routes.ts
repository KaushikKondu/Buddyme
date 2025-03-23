import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginUserSchema, registerUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with '/api' prefix
  
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validation = registerUserSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validation.error.format() 
        });
      }
      
      const { email, password, displayName } = validation.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      
      // Create new user
      const user = await storage.createUser({
        email,
        password, // Note: In a real app, this should be hashed
        displayName,
        provider: 'email',
        providerId: null,
        photoURL: null
      });
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const validation = loginUserSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validation.error.format() 
        });
      }
      
      const { email, password } = validation.data;
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      if (user.password !== password) { // Note: In a real app, use proper password comparison
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: 'Login successful',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Provider auth verification endpoint
  app.post('/api/auth/provider-check', async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        providerId: z.string(),
        provider: z.string(),
        displayName: z.string().optional(),
        photoURL: z.string().optional()
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validation.error.format() 
        });
      }
      
      const { email, providerId, provider, displayName, photoURL } = validation.data;
      
      // Check if user exists by providerId
      let user = await storage.getUserByProviderId(providerId);
      
      // If not, check by email
      if (!user) {
        user = await storage.getUserByEmail(email);
      }
      
      // If still not, create a new user
      if (!user) {
        user = await storage.createUser({
          email,
          password: null,
          providerId,
          provider,
          displayName: displayName || email.split('@')[0],
          photoURL: photoURL || null
        });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: 'Authentication successful',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // User and buddy-related routes
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/users/:id/interests', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const schema = z.object({ interest: z.string() });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validation.error.format() 
        });
      }
      
      const { interest } = validation.data;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      await storage.addUserInterest(userId, interest);
      
      res.status(200).json({ message: 'Interest added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/users/:id/matches', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const interests = await storage.getUserInterests(userId);
      
      if (interests.length === 0) {
        return res.status(200).json([]);
      }
      
      const matches = await storage.getUsersByInterests(interests);
      
      // Filter out the requesting user
      const filteredMatches = matches.filter(match => match.id !== userId);
      
      // Remove password from matched users
      const safeMatches = filteredMatches.map(match => {
        const { password: _, ...matchWithoutPassword } = match;
        return matchWithoutPassword;
      });
      
      res.status(200).json(safeMatches);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/users/:id/connect/:buddyId', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const buddyId = parseInt(req.params.buddyId);
      
      // Validate both users exist
      const user = await storage.getUser(userId);
      const buddy = await storage.getUser(buddyId);
      
      if (!user || !buddy) {
        return res.status(404).json({ message: 'User or buddy not found' });
      }
      
      // Create connection
      await storage.createUserConnection(userId, buddyId);
      
      res.status(200).json({ message: 'Connection request sent' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
