import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { z } from "zod";
import { insertBlogPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get all blog posts
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get featured blog post - this must come before the ":id" route to prevent conflicts
  app.get("/api/posts/featured", async (req, res) => {
    try {
      const featuredPost = await storage.getFeaturedBlogPost();
      if (!featuredPost) {
        return res.status(404).json({ message: "No featured post found" });
      }

      res.json(featuredPost);
    } catch (error) {
      console.error("Error fetching featured post:", error);
      res.status(500).json({ message: "Failed to fetch featured post" });
    }
  });

  // Search blog posts
  app.get("/api/posts/search", async (req, res) => {
    const query = req.query.q?.toString().toLowerCase() || '';
    if (!query) {
      return res.json([]);
    }

    const allPosts = await storage.getAllBlogPosts();
    const posts = allPosts.filter(post => {
      const title = post.title.toLowerCase();
      const content = post.content.toLowerCase();
      // Fuzzy search - check if query characters appear in sequence
      const fuzzyMatch = (str: string) => {
        let i = 0;
        for (const char of query) {
          i = str.indexOf(char, i);
          if (i === -1) return false;
          i++;
        }
        return true;
      };
      return fuzzyMatch(title) || content.includes(query);
    });
    res.json(posts);
  });

  // Get posts by tag
  app.get("/api/posts/by-tag/:tagId", async (req, res) => {
    try {
      const tagId = parseInt(req.params.tagId);
      if (isNaN(tagId)) {
        return res.status(400).json({ message: "Invalid tag ID" });
      }

      const posts = await storage.getBlogPostsByTagId(tagId);
      res.json(posts);
    } catch (error) {
      console.error("Error filtering blog posts by tag:", error);
      res.status(500).json({ message: "Failed to filter blog posts by tag" });
    }
  });

  // Get a single blog post by ID - this must come after all other specific post routes
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get all tags
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Create a new blog post (for admin functionality)
  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const newPost = await storage.createBlogPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          errors: error.errors 
        });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}