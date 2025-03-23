import { 
  users, 
  type User, 
  type InsertUser, 
  userInterests, 
  userConnections 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByProviderId(providerId: string): Promise<User | undefined>;
  getUsersByInterests(interests: string[]): Promise<User[]>;
  addUserInterest(userId: number, interest: string): Promise<void>;
  getUserInterests(userId: number): Promise<string[]>;
  createUserConnection(userId: number, connectedUserId: number): Promise<void>;
  getUserConnections(userId: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private interests: Map<number, Set<string>>;
  private connections: Map<number, Map<number, string>>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.interests = new Map();
    this.connections = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUserByProviderId(providerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.providerId === providerId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      interests: [], 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  async getUsersByInterests(interests: string[]): Promise<User[]> {
    const userIds: Set<number> = new Set();
    
    // Find users with matching interests
    for (const [userId, userInterests] of this.interests.entries()) {
      for (const interest of interests) {
        if (userInterests.has(interest)) {
          userIds.add(userId);
          break;
        }
      }
    }
    
    // Get user objects for these IDs
    return Array.from(userIds).map(id => this.users.get(id)).filter(Boolean) as User[];
  }
  
  async addUserInterest(userId: number, interest: string): Promise<void> {
    if (!this.interests.has(userId)) {
      this.interests.set(userId, new Set());
    }
    this.interests.get(userId)!.add(interest);
    
    // Also update the user's interests array
    const user = this.users.get(userId);
    if (user) {
      const interests = user.interests as string[];
      if (!interests.includes(interest)) {
        user.interests = [...interests, interest];
        this.users.set(userId, user);
      }
    }
  }
  
  async getUserInterests(userId: number): Promise<string[]> {
    if (!this.interests.has(userId)) {
      return [];
    }
    return Array.from(this.interests.get(userId)!);
  }
  
  async createUserConnection(userId: number, connectedUserId: number): Promise<void> {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, new Map());
    }
    this.connections.get(userId)!.set(connectedUserId, "pending");
  }
  
  async getUserConnections(userId: number): Promise<User[]> {
    if (!this.connections.has(userId)) {
      return [];
    }
    
    const connectionIds = Array.from(this.connections.get(userId)!.keys());
    return connectionIds
      .map(id => this.users.get(id))
      .filter(Boolean) as User[];
  }
}

export const storage = new MemStorage();
