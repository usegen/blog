import type { Router } from "express";
import { storage } from "./storage";
import { ZodError } from "zod";
import { insertBlogPostSchema, insertTagSchema } from "@shared/schema";

export async function registerRoutes(router: Router): Promise<void> {
  // Get all blog posts
  router.get("/posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Search blog posts
  router.get("/posts/search", async (req, res) => {
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
  router.get("/posts/by-tag/:tagId", async (req, res) => {
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

  // Get a single blog post by slug
  router.get("/posts/by-slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
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
  router.get("/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Create a new blog post
  router.post("/posts-create", async (req, res) => {
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

  // Delete a blog post
  router.delete("/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Create a new tag
  router.post("/tags-create", async (req, res) => {
    try {
      const tagData = insertTagSchema.parse(req.body);
      console.log('Creating tag:', tagData);
      const newTag = await storage.createTag(tagData);
      res.status(201).json(newTag);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid tag data", 
          errors: error.errors 
        });
      }
      console.error("Error creating tag:", error);
      res.status(500).json({ message: "Failed to create tag" });
    }
  });

  // Delete a tag
  router.delete("/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tag ID" });
      }

      const tag = await storage.getTagById(id);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }

      await storage.deleteTag(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });
}