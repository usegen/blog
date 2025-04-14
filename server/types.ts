export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: Date;
  featured: boolean | null;
  tagId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  // User methods
  getUserById(id: number): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser>;
  updateUser(id: number, user: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: number): Promise<boolean>;

  // Blog post methods
  getBlogPostById(id: number): Promise<IBlogPost | null>;
  getBlogPostBySlug(slug: string): Promise<IBlogPost | null>;
  getAllBlogPosts(): Promise<IBlogPost[]>;
  getFeaturedBlogPosts(): Promise<IBlogPost[]>;
  getBlogPostsByTag(tagId: number): Promise<IBlogPost[]>;
  createBlogPost(post: Omit<IBlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<IBlogPost>;
  updateBlogPost(id: number, post: Partial<IBlogPost>): Promise<IBlogPost | null>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Comment methods
  getCommentsByPostId(postId: number): Promise<IComment[]>;
  createComment(comment: Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<IComment>;
  updateComment(id: number, comment: Partial<IComment>): Promise<IComment | null>;
  deleteComment(id: number): Promise<boolean>;

  // Tag methods
  getAllTags(): Promise<ITag[]>;
  getTagById(id: number): Promise<ITag | null>;
  getTagBySlug(slug: string): Promise<ITag | null>;
  createTag(tag: Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITag>;
  updateTag(id: number, tag: Partial<ITag>): Promise<ITag | null>;
  deleteTag(id: number): Promise<boolean>;
} 