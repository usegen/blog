import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema from original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tags for blog posts
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  icon: true,
});

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull(),
  date: timestamp("date").notNull(),
  featured: boolean("featured").default(false),
  tagId: integer("tag_id").references(() => tags.id),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Relations for tags
export const tagsRelations = relations(tags, ({ many }) => ({
  blogPosts: many(blogPosts),
}));

// Relations for blog posts
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  tag: one(tags, {
    fields: [blogPosts.tagId],
    references: [tags.id],
  }),
}));

// For frontend, we often need the blog post with its tag information
export interface BlogPostWithTag extends BlogPost {
  tag: Tag;
}
