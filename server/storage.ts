import { tags, type Tag, type InsertTag, blogPosts, type BlogPost, type InsertBlogPost, type BlogPostWithTag, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, like, or, desc } from "drizzle-orm";
import  slugify from "slugify";
import { IBlogPost, IStorage, IUser, IComment, ITag } from './types';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tag methods
  getAllTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: number, tag: InsertTag): Promise<Tag>;
  deleteTag(id: number): Promise<void>;
  
  // Blog post methods
  getAllBlogPosts(): Promise<BlogPostWithTag[]>;
  getBlogPostById(id: number): Promise<BlogPostWithTag | undefined>;
  getBlogPostsByTagId(tagId: number): Promise<BlogPostWithTag[]>;
  searchBlogPosts(query: string): Promise<BlogPostWithTag[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  getFeaturedBlogPost(): Promise<BlogPostWithTag | undefined>;
  updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tags: Map<number, Tag>;
  private blogPosts: Map<number, BlogPost>;
  private currentUserId: number;
  private currentTagId: number;
  private currentBlogPostId: number;

  constructor() {
    this.users = new Map();
    this.tags = new Map();
    this.blogPosts = new Map();
    this.currentUserId = 1;
    this.currentTagId = 1;
    this.currentBlogPostId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Tag methods
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTagById(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const id = this.currentTagId++;
    const newTag: Tag = { ...tag, id };
    this.tags.set(id, newTag);
    return newTag;
  }
  
  async updateTag(id: number, tagData: InsertTag): Promise<Tag> {
    const existingTag = this.tags.get(id);
    if (!existingTag) {
      throw new Error(`Tag with id ${id} not found`);
    }
    
    const updatedTag: Tag = { ...existingTag, ...tagData };
    this.tags.set(id, updatedTag);
    return updatedTag;
  }
  
  async deleteTag(id: number): Promise<void> {
    this.tags.delete(id);
  }
  
  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPostWithTag[]> {
    return Array.from(this.blogPosts.values()).map(post => {
      const tag = this.tags.get(post.tagId);
      if (!tag) {
        throw new Error(`Tag with id ${post.tagId} not found`);
      }
      return { ...post, tag };
    });
  }
  
  async getBlogPostById(id: number): Promise<BlogPostWithTag | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const tag = this.tags.get(post.tagId);
    if (!tag) {
      throw new Error(`Tag with id ${post.tagId} not found`);
    }
    
    return { ...post, tag };
  }
  
  async getBlogPostsByTagId(tagId: number): Promise<BlogPostWithTag[]> {
    const posts = Array.from(this.blogPosts.values())
      .filter(post => post.tagId === tagId);
      
    return posts.map(post => {
      const tag = this.tags.get(post.tagId);
      if (!tag) {
        throw new Error(`Tag with id ${post.tagId} not found`);
      }
      return { ...post, tag };
    });
  }
  
  async searchBlogPosts(query: string): Promise<BlogPostWithTag[]> {
    const lowercaseQuery = query.toLowerCase();
    
    const filteredPosts = Array.from(this.blogPosts.values())
      .filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery)
      );
      
    return filteredPosts.map(post => {
      const tag = this.tags.get(post.tagId);
      if (!tag) {
        throw new Error(`Tag with id ${post.tagId} not found`);
      }
      return { ...post, tag };
    });
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const newPost: BlogPost = { ...post, id };
    this.blogPosts.set(id, newPost);
    return newPost;
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }
  
  async getFeaturedBlogPost(): Promise<BlogPostWithTag | undefined> {
    const featuredPost = Array.from(this.blogPosts.values()).find(post => post.featured);
    
    if (!featuredPost) return undefined;
    
    const tag = this.tags.get(featuredPost.tagId);
    if (!tag) {
      throw new Error(`Tag with id ${featuredPost.tagId} not found`);
    }
    
    return { ...featuredPost, tag };
  }
  
  async updateBlogPost(id: number, postData: InsertBlogPost): Promise<BlogPost> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    
    const updatedPost: BlogPost = { 
      ...existingPost, 
      ...postData,
      featured: postData.featured ?? existingPost.featured,
      tagId: postData.tagId ?? existingPost.tagId,
      slug: postData.slug ?? existingPost.slug
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Create tags
    const mountainsTag: InsertTag = { name: "Mountains", icon: "fa-mountain" };
    const naturesTag: InsertTag = { name: "Nature", icon: "fa-tree" };
    const foodTag: InsertTag = { name: "Food", icon: "fa-utensils" };
    const historyTag: InsertTag = { name: "History", icon: "fa-landmark" };
    const citiesTag: InsertTag = { name: "Cities", icon: "fa-city" };
    const coastlineTag: InsertTag = { name: "Coastline", icon: "fa-water" };
    
    this.createTag(mountainsTag);
    this.createTag(naturesTag);
    this.createTag(foodTag);
    this.createTag(historyTag);
    this.createTag(citiesTag);
    this.createTag(coastlineTag);
    
    // Create blog posts
    const blogPosts: InsertBlogPost[] = [
      {
        title: "Dracula's Castle: Beyond the Myths",
        content: "Bran Castle, commonly known as Dracula's Castle, is one of Romania's most iconic landmarks. While the association with Bram Stoker's fictional character is tenuous, the real history of this medieval fortress is just as fascinating. The castle was built in the 14th century and served as a strategic military defense point for centuries. Today, it stands as a magnificent museum showcasing historical artifacts and offering breathtaking views of the surrounding Carpathian Mountains. Visitors can explore its winding staircases, secret passages, and elegant royal chambers, getting a glimpse into Romania's rich medieval past. Despite the Dracula myths, the true value of Bran Castle lies in its authentic cultural and historical significance.",
        excerpt: "Exploring the real history behind Romania's most famous castle and separating fact from fiction about its connection to Vlad the Impaler.",
        imageUrl: "https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=800&auto=format&fit=crop",
        author: "Maria Popescu",
        date: new Date("2023-11-10"),
        tagId: 4, // History
        featured: true
      },
      {
        title: "The Spectacular Transfăgărășan Highway",
        content: "Often referred to as 'the best road in the world' by Top Gear, the Transfăgărășan Highway is a marvel of engineering cutting through Romania's Carpathian Mountains. Built in the 1970s as a strategic military route, this winding road offers some of the most spectacular driving experiences in Europe. As you navigate its hairpin turns and steep climbs, you'll be rewarded with breathtaking views of alpine landscapes, pristine lakes, and dense forests. The road reaches its highest point at Bâlea Lake, a glacier lake situated at 2,034 meters above sea level. Remember that the highway is usually open only from July to October due to heavy snow during the rest of the year. For photography enthusiasts, the famous zigzag section near the northern end offers the most iconic views.",
        excerpt: "Driving through the clouds on Romania's most breathtaking road - an engineering marvel cutting through the Carpathian Mountains.",
        imageUrl: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=600&auto=format&fit=crop",
        author: "Maria Popescu",
        date: new Date("2023-10-12"),
        tagId: 1 // Mountains
      },
      {
        title: "The Colorful Medieval Citadel of Sighișoara",
        content: "Stepping into Sighișoara's historic center feels like traveling back in time to medieval Transylvania. This remarkably well-preserved walled town, with its colorful buildings, cobblestone streets, and imposing clock tower, is a UNESCO World Heritage site and one of Europe's most beautiful medieval citadels. Founded by German craftsmen and merchants known as the Saxons in the 12th century, Sighișoara maintains much of its original architecture and charm. The city is also famous as the birthplace of Vlad the Impaler, the historical figure who inspired Bram Stoker's Dracula character. Visitors can see his birth house, climb the 14th-century clock tower for panoramic views, and wander through narrow streets lined with pastel-colored houses. The annual Medieval Festival in July brings the citadel's history to life with costumed performances, traditional crafts, and music.",
        excerpt: "Exploring the birthplace of Vlad the Impaler and one of the best-preserved medieval towns in Europe.",
        imageUrl: "https://images.unsplash.com/photo-1642146394116-98241a96c8b7?q=80&w=600&auto=format&fit=crop",
        author: "Maria Popescu",
        date: new Date("2023-09-28"),
        tagId: 4 // History
      },
      {
        title: "A Taste of Romania: Traditional Cuisine",
        content: "Romanian cuisine is a delicious reflection of the country's history, geography, and cultural influences. Hearty, flavorful, and deeply satisfying, traditional Romanian dishes showcase the bounty of the land. Sarmale (cabbage rolls filled with minced meat and rice) are perhaps the most iconic dish, especially popular during holidays and celebrations. Mămăligă, a polenta-like cornmeal dish, has been a staple of Romanian diet for centuries, often served as a side dish or as the base for other preparations. For those with a sweet tooth, papanași are a must-try dessert - these cheese doughnuts topped with sour cream and jam combine sweet and tangy flavors perfectly. Romanian cuisine also features excellent soups like ciorbă de burtă (tripe soup) and ciorbă de perișoare (meatball soup), both made tangy with a souring agent called borș. Wash it all down with țuică, a traditional plum brandy, or try some of Romania's excellent but underrated wines from regions like Dealu Mare or Recaș.",
        excerpt: "Savoring the rich flavors of Romanian dishes from sarmale to mămăligă and papanași.",
        imageUrl: "https://images.unsplash.com/photo-1629221715302-61afce7a0e42?q=80&w=600&auto=format&fit=crop",
        author: "Maria Popescu",
        date: new Date("2023-08-15"),
        tagId: 3 // Food
      },
      {
        title: "Bucovina's Painted Monasteries",
        content: "In the northeastern region of Romania lies a treasure of medieval art and spirituality: the painted monasteries of Bucovina. These UNESCO-protected sites feature extraordinary exterior frescoes dating back to the 15th and 16th centuries, painted in vibrant blues, greens, and reds that have remarkably retained their brilliance over centuries. Each monastery tells biblical stories and depicts saints' lives through these intricate paintings, created as a way to educate the illiterate population about Christianity. The most famous include Voroneț (known for its distinctive 'Voroneț blue' backdrop), Humor, Moldovița, Sucevița, and Arbore. What makes these frescoes particularly remarkable is how they've withstood the harsh weather conditions of the region for hundreds of years. The monasteries are still active places of worship, with nuns and monks maintaining the traditions of Orthodox Christianity. Visitors can explore the painted churches, admire the surrounding peaceful countryside, and even purchase handmade crafts from local artisans.",
        excerpt: "Discovering the UNESCO World Heritage frescoes that have survived for centuries on the exterior walls of Moldavian monasteries.",
        imageUrl: "https://images.unsplash.com/photo-1603201238620-4f85b6e0f3da?q=80&w=600&auto=format&fit=crop",
        author: "Maria Popescu",
        date: new Date("2023-07-22"),
        tagId: 4 // History
      },
      {
        title: "The Wild Beauty of the Danube Delta",
        content: "The Danube Delta, where Europe's second-longest river meets the Black Sea, is one of the continent's most spectacular natural areas and a paradise for nature lovers and birdwatchers. This UNESCO Biosphere Reserve hosts the largest reed bed in the world and serves as home to an incredible diversity of flora and fauna. The labyrinth of channels, lakes, and islands creates a unique ecosystem that supports over 300 species of birds, including rare pelicans, herons, and eagles. Many of these birds migrate from as far as Africa and Asia, making the delta an essential habitat for global biodiversity. Exploring the delta is best done by boat, whether on a traditional wooden vessel or a modern kayak. Visitors can stay in floating hotels or in villages like Sfântu Gheorghe or Letea, where traditional fishing communities maintain their centuries-old way of life. Beyond birdwatching, the delta offers opportunities for fishing, photography, and simply immersing yourself in the tranquility of this pristine natural environment. The best time to visit is from spring to early autumn, with May and June being ideal for birdwatching.",
        excerpt: "Exploring Europe's largest wetland and its incredible biodiversity - a paradise for birdwatchers and nature lovers.",
        imageUrl: "https://images.unsplash.com/photo-1627908355692-08de649d8c5e?q=80&w=600&auto=format&fit=crop",
        author: "Maria Popescu",
        date: new Date("2023-06-18"),
        tagId: 2 // Nature
      },
      {
        title: "Bucharest: The Paris of the East",
        content: "Romania's capital city, Bucharest, presents a fascinating architectural tapestry that tells the story of its complex history. Once known as 'Little Paris' or 'The Paris of the East,' the city earned this nickname in the early 20th century due to its elegant architecture, tree-lined boulevards, and vibrant cultural scene that mirrored the French capital. Walking through the historic center, you'll discover beautiful Belle Époque buildings alongside Neo-Classical palaces, Art Nouveau villas, and imposing Orthodox churches. However, Bucharest's architectural landscape was dramatically transformed during the Communist era (1947-1989), especially under Nicolae Ceaușescu's regime. The massive Palace of the Parliament (formerly the People's House), the second-largest administrative building in the world after the Pentagon, stands as the most prominent example of Communist architecture. Today, contemporary glass-and-steel structures rise among these historical layers, creating a unique urban landscape where Romania's past, present, and future converge. Beyond architecture, Bucharest offers excellent museums, beautiful parks, trendy cafes, and a vibrant nightlife that makes it one of Eastern Europe's most dynamic capitals.",
        excerpt: "Uncovering the fascinating mix of architectural styles in Romania's capital - from Belle Époque to Communist era and modern buildings.",
        imageUrl: "https://images.unsplash.com/photo-1560686877-9ed0867740f9?q=80&w=600&auto=format&fit=crop",
        author: "Maria Popescu",
        date: new Date("2023-05-05"),
        tagId: 5 // Cities
      }
    ];
    
    for (const post of blogPosts) {
      this.createBlogPost(post);
    }
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Tag methods
  async getAllTags(): Promise<Tag[]> {
    return db.select().from(tags);
  }
  
  async getTagById(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }
  
  async updateTag(id: number, tagData: InsertTag): Promise<Tag> {
    const [updatedTag] = await db
      .update(tags)
      .set(tagData)
      .where(eq(tags.id, id))
      .returning();
      
    if (!updatedTag) {
      throw new Error(`Tag with id ${id} not found`);
    }
    
    return updatedTag;
  }
  
  async deleteTag(id: number): Promise<void> {
    await db.delete(tags).where(eq(tags.id, id));
  }
  
  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPostWithTag[]> {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.date));
    
    // Fetch all tags
    const allTags = await this.getAllTags();
    const tagMap = new Map<number, Tag>();
    allTags.forEach(tag => tagMap.set(tag.id, tag));
    
    // Join posts with their tags
    return posts.map(post => ({
      ...post,
      tag: tagMap.get(post.tagId)!
    }));
  }
  
  async getBlogPostById(id: number): Promise<BlogPostWithTag | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    
    if (!post) {
      return undefined;
    }
    
    const [tag] = await db.select().from(tags).where(eq(tags.id, post.tagId));
    
    return {
      ...post,
      tag
    };
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostWithTag | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    
    if (!post) {
      return undefined;
    }
    
    const [tag] = await db.select().from(tags).where(eq(tags.id, post.tagId));
    
    return {
      ...post,
      tag
    };
  }
  
  async getBlogPostsByTagId(tagId: number): Promise<BlogPostWithTag[]> {
    const posts = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.tagId, tagId))
      .orderBy(desc(blogPosts.date));
    
    const [tag] = await db.select().from(tags).where(eq(tags.id, tagId));
    
    return posts.map(post => ({
      ...post,
      tag
    }));
  }
  
  async searchBlogPosts(query: string): Promise<BlogPostWithTag[]> {
    // Create pattern for LIKE search
    const pattern = `%${query}%`;
    
    const posts = await db.select()
      .from(blogPosts)
      .where(
        or(
          like(blogPosts.title, pattern),
          like(blogPosts.content, pattern),
          like(blogPosts.excerpt, pattern)
        )
      )
      .orderBy(desc(blogPosts.date));
    
    // Fetch all tags
    const allTags = await this.getAllTags();
    const tagMap = new Map<number, Tag>();
    allTags.forEach(tag => tagMap.set(tag.id, tag));
    
    // Join posts with their tags
    return posts.map(post => ({
      ...post,
      tag: tagMap.get(post.tagId)!
    }));
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const slug = post.slug || slugify(post.title);
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        ...post,
        slug,
        featured: post.featured ?? false,
        tagId: post.tagId ?? null
      })
      .returning();
    return newPost;
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  
  async getFeaturedBlogPost(): Promise<BlogPostWithTag | undefined> {
    const [post] = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(blogPosts.date));
    
    if (!post) {
      return undefined;
    }
    
    const [tag] = await db.select().from(tags).where(eq(tags.id, post.tagId));
    
    return {
      ...post,
      tag
    };
  }
  
  async updateBlogPost(id: number, postData: InsertBlogPost): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...postData,
        featured: postData.featured ?? undefined,
        tagId: postData.tagId ?? undefined,
        slug: postData.slug ?? undefined
      })
      .where(eq(blogPosts.id, id))
      .returning();
      
    if (!updatedPost) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    
    return updatedPost;
  }
  
  // Method to seed the database with initial data
  async seedDatabase(): Promise<void> {
    try {
      // Check if we already have data
      const tagsResult = await db.select().from(tags).limit(1);
      if (tagsResult.length > 0) {
        console.log("Database already has data, skipping seed");
        return;
      }
      
      console.log("Seeding database with initial data");
      
      // Create tags
      const mountainsTag: InsertTag = { name: "Mountains", icon: "fa-mountain" };
      const naturesTag: InsertTag = { name: "Nature", icon: "fa-tree" };
      const foodTag: InsertTag = { name: "Food", icon: "fa-utensils" };
      const historyTag: InsertTag = { name: "History", icon: "fa-landmark" };
      const citiesTag: InsertTag = { name: "Cities", icon: "fa-city" };
      const coastlineTag: InsertTag = { name: "Coastline", icon: "fa-water" };
      
      const tag1 = await this.createTag(mountainsTag);
      const tag2 = await this.createTag(naturesTag);
      const tag3 = await this.createTag(foodTag);
      const tag4 = await this.createTag(historyTag);
      const tag5 = await this.createTag(citiesTag);
      const tag6 = await this.createTag(coastlineTag);
      
      // Create blog posts
      const blogPosts: InsertBlogPost[] = [
        {
          title: "Dracula's Castle: Beyond the Myths",
          content: "Bran Castle, commonly known as Dracula's Castle, is one of Romania's most iconic landmarks. While the association with Bram Stoker's fictional character is tenuous, the real history of this medieval fortress is just as fascinating. The castle was built in the 14th century and served as a strategic military defense point for centuries. Today, it stands as a magnificent museum showcasing historical artifacts and offering breathtaking views of the surrounding Carpathian Mountains. Visitors can explore its winding staircases, secret passages, and elegant royal chambers, getting a glimpse into Romania's rich medieval past. Despite the Dracula myths, the true value of Bran Castle lies in its authentic cultural and historical significance.",
          excerpt: "Exploring the real history behind Romania's most famous castle and separating fact from fiction about its connection to Vlad the Impaler.",
          imageUrl: "https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=800&auto=format&fit=crop",
          author: "Maria Popescu",
          date: new Date("2023-11-10"),
          tagId: tag4.id,
          featured: true
        },
        {
          title: "The Spectacular Transfăgărășan Highway",
          content: "Often referred to as 'the best road in the world' by Top Gear, the Transfăgărășan Highway is a marvel of engineering cutting through Romania's Carpathian Mountains. Built in the 1970s as a strategic military route, this winding road offers some of the most spectacular driving experiences in Europe. As you navigate its hairpin turns and steep climbs, you'll be rewarded with breathtaking views of alpine landscapes, pristine lakes, and dense forests. The road reaches its highest point at Bâlea Lake, a glacier lake situated at 2,034 meters above sea level. Remember that the highway is usually open only from July to October due to heavy snow during the rest of the year. For photography enthusiasts, the famous zigzag section near the northern end offers the most iconic views.",
          excerpt: "Driving through the clouds on Romania's most breathtaking road - an engineering marvel cutting through the Carpathian Mountains.",
          imageUrl: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=600&auto=format&fit=crop",
          author: "Maria Popescu",
          date: new Date("2023-10-12"),
          tagId: tag1.id,
          featured: false
        },
        {
          title: "The Colorful Medieval Citadel of Sighișoara",
          content: "Stepping into Sighișoara's historic center feels like traveling back in time to medieval Transylvania. This remarkably well-preserved walled town, with its colorful buildings, cobblestone streets, and imposing clock tower, is a UNESCO World Heritage site and one of Europe's most beautiful medieval citadels. Founded by German craftsmen and merchants known as the Saxons in the 12th century, Sighișoara maintains much of its original architecture and charm. The city is also famous as the birthplace of Vlad the Impaler, the historical figure who inspired Bram Stoker's Dracula character. Visitors can see his birth house, climb the 14th-century clock tower for panoramic views, and wander through narrow streets lined with pastel-colored houses. The annual Medieval Festival in July brings the citadel's history to life with costumed performances, traditional crafts, and music.",
          excerpt: "Exploring the birthplace of Vlad the Impaler and one of the best-preserved medieval towns in Europe.",
          imageUrl: "https://images.unsplash.com/photo-1642146394116-98241a96c8b7?q=80&w=600&auto=format&fit=crop",
          author: "Maria Popescu",
          date: new Date("2023-09-28"),
          tagId: tag4.id,
          featured: false
        },
        {
          title: "A Taste of Romania: Traditional Cuisine",
          content: "Romanian cuisine is a delicious reflection of the country's history, geography, and cultural influences. Hearty, flavorful, and deeply satisfying, traditional Romanian dishes showcase the bounty of the land. Sarmale (cabbage rolls filled with minced meat and rice) are perhaps the most iconic dish, especially popular during holidays and celebrations. Mămăligă, a polenta-like cornmeal dish, has been a staple of Romanian diet for centuries, often served as a side dish or as the base for other preparations. For those with a sweet tooth, papanași are a must-try dessert - these cheese doughnuts topped with sour cream and jam combine sweet and tangy flavors perfectly. Romanian cuisine also features excellent soups like ciorbă de burtă (tripe soup) and ciorbă de perișoare (meatball soup), both made tangy with a souring agent called borș. Wash it all down with țuică, a traditional plum brandy, or try some of Romania's excellent but underrated wines from regions like Dealu Mare or Recaș.",
          excerpt: "Savoring the rich flavors of Romanian dishes from sarmale to mămăligă and papanași.",
          imageUrl: "https://images.unsplash.com/photo-1629221715302-61afce7a0e42?q=80&w=600&auto=format&fit=crop",
          author: "Maria Popescu",
          date: new Date("2023-08-15"),
          tagId: tag3.id,
          featured: false
        },
        {
          title: "Bucovina's Painted Monasteries",
          content: "In the northeastern region of Romania lies a treasure of medieval art and spirituality: the painted monasteries of Bucovina. These UNESCO-protected sites feature extraordinary exterior frescoes dating back to the 15th and 16th centuries, painted in vibrant blues, greens, and reds that have remarkably retained their brilliance over centuries. Each monastery tells biblical stories and depicts saints' lives through these intricate paintings, created as a way to educate the illiterate population about Christianity. The most famous include Voroneț (known for its distinctive 'Voroneț blue' backdrop), Humor, Moldovița, Sucevița, and Arbore. What makes these frescoes particularly remarkable is how they've withstood the harsh weather conditions of the region for hundreds of years. The monasteries are still active places of worship, with nuns and monks maintaining the traditions of Orthodox Christianity. Visitors can explore the painted churches, admire the surrounding peaceful countryside, and even purchase handmade crafts from local artisans.",
          excerpt: "Discovering the UNESCO World Heritage frescoes that have survived for centuries on the exterior walls of Moldavian monasteries.",
          imageUrl: "https://images.unsplash.com/photo-1603201238620-4f85b6e0f3da?q=80&w=600&auto=format&fit=crop",
          author: "Maria Popescu",
          date: new Date("2023-07-22"),
          tagId: tag4.id,
          featured: false
        },
        {
          title: "The Wild Beauty of the Danube Delta",
          content: "The Danube Delta, where Europe's second-longest river meets the Black Sea, is one of the continent's most spectacular natural areas and a paradise for nature lovers and birdwatchers. This UNESCO Biosphere Reserve hosts the largest reed bed in the world and serves as home to an incredible diversity of flora and fauna. The labyrinth of channels, lakes, and islands creates a unique ecosystem that supports over 300 species of birds, including rare pelicans, herons, and eagles. Many of these birds migrate from as far as Africa and Asia, making the delta an essential habitat for global biodiversity. Exploring the delta is best done by boat, whether on a traditional wooden vessel or a modern kayak. Visitors can stay in floating hotels or in villages like Sfântu Gheorghe or Letea, where traditional fishing communities maintain their centuries-old way of life. Beyond birdwatching, the delta offers opportunities for fishing, photography, and simply immersing yourself in the tranquility of this pristine natural environment. The best time to visit is from spring to early autumn, with May and June being ideal for birdwatching.",
          excerpt: "Exploring Europe's largest wetland and its incredible biodiversity - a paradise for birdwatchers and nature lovers.",
          imageUrl: "https://images.unsplash.com/photo-1627908355692-08de649d8c5e?q=80&w=600&auto=format&fit=crop",
          author: "Maria Popescu",
          date: new Date("2023-06-18"),
          tagId: tag2.id,
          featured: false
        },
        {
          title: "Bucharest: The Paris of the East",
          content: "Romania's capital city, Bucharest, presents a fascinating architectural tapestry that tells the story of its complex history. Once known as 'Little Paris' or 'The Paris of the East,' the city earned this nickname in the early 20th century due to its elegant architecture, tree-lined boulevards, and vibrant cultural scene that mirrored the French capital. Walking through the historic center, you'll discover beautiful Belle Époque buildings alongside Neo-Classical palaces, Art Nouveau villas, and imposing Orthodox churches. However, Bucharest's architectural landscape was dramatically transformed during the Communist era (1947-1989), especially under Nicolae Ceaușescu's regime. The massive Palace of the Parliament (formerly the People's House), the second-largest administrative building in the world after the Pentagon, stands as the most prominent example of Communist architecture. Today, contemporary glass-and-steel structures rise among these historical layers, creating a unique urban landscape where Romania's past, present, and future converge. Beyond architecture, Bucharest offers excellent museums, beautiful parks, trendy cafes, and a vibrant nightlife that makes it one of Eastern Europe's most dynamic capitals.",
          excerpt: "Uncovering the fascinating mix of architectural styles in Romania's capital - from Belle Époque to Communist era and modern buildings.",
          imageUrl: "https://images.unsplash.com/photo-1560686877-9ed0867740f9?q=80&w=600&auto=format&fit=crop",
          author: "Maria Popescu",
          date: new Date("2023-05-05"),
          tagId: tag5.id,
          featured: false
        }
      ];
      
      for (const post of blogPosts) {
        await this.createBlogPost(post);
      }
      
      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
}

// Use the DatabaseStorage implementation
export const storage = new DatabaseStorage();
