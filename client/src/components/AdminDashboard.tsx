import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, Pencil, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface Tag {
  id: number;
  name: string;
  icon: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
  featured: boolean;
  tagId: number | null;
}

// Zod schema for post validation
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  author: z.string().min(1, "Author is required"),
  date: z.string().min(1, "Date is required"),
  featured: z.boolean().default(false),
  tagId: z.number().nullable()
});

type PostFormData = z.infer<typeof postSchema>;

interface PostSubmitData extends Omit<PostFormData, 'date'> {
  date: string;
}

export function AdminDashboard() {
  // Tag states
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagIcon, setNewTagIcon] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // Post states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Common states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      featured: false,
      tagId: null
    }
  });

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError('Failed to load tags');
    }
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
    }
  };

  useEffect(() => {
    fetchTags();
    fetchPosts();
  }, []);

  // Tag handlers
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tags-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTagName,
          icon: newTagIcon,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tag');
      }
      
      setSuccess('Tag created successfully');
      setNewTagName('');
      setNewTagIcon('');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTagName,
          icon: newTagIcon,
        }),
      });

      if (!response.ok) throw new Error('Failed to update tag');
      
      setSuccess('Tag updated successfully');
      setEditingTag(null);
      setNewTagName('');
      setNewTagIcon('');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update tag');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tag');
      
      setSuccess('Tag deleted successfully');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete tag');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Post handlers
  const handleCreatePost = async (data: PostFormData) => {
    try {
      const response = await fetch('/api/posts-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: new Date(data.date)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      setSuccess('Post created successfully');
      reset();
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdatePost = async (data: PostFormData) => {
    if (!editingPost) return;

    try {
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: new Date(data.date)
        }),
      });

      if (!response.ok) throw new Error('Failed to update post');
      
      setSuccess('Post updated successfully');
      setEditingPost(null);
      reset();
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update post');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      setSuccess('Post deleted successfully');
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete post');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Start editing functions
  const startEditingTag = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagIcon(tag.icon);
  };

  const startEditingPost = (post: BlogPost) => {
    setEditingPost(post);
    Object.entries(post).forEach(([key, value]) => {
      setValue(key as keyof PostFormData, value);
    });
  };

  // Cancel editing functions
  const cancelEditing = () => {
    setEditingTag(null);
    setEditingPost(null);
    setNewTagName('');
    setNewTagIcon('');
    reset();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Status Messages */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="tags" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tags">
            <i className="fas fa-tags mr-2" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="posts">
            <FileText className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
        </TabsList>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Tags List - Left Side (1/4 width) */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Existing Tags</h2>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingTag(null);
                    setNewTagName('');
                    setNewTagIcon('');
                  }}
                >
                  Create New
                </Button>
              </div>
              <div className="space-y-3">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`fas ${tag.icon}`} />
                      <span>{tag.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditingTag(tag)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Create/Edit Tag Form - Right Side (3/4 width) */}
            <Card className="p-6 md:col-span-3">
              <h2 className="text-xl font-semibold mb-4">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h2>
              <form onSubmit={editingTag ? handleUpdateTag : handleCreateTag} className="space-y-4">
                <div>
                  <Label htmlFor="tagName">Tag Name</Label>
                  <Input
                    id="tagName"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tagIcon">Tag Icon (Font Awesome class)</Label>
                  <Input
                    id="tagIcon"
                    value={newTagIcon}
                    onChange={(e) => setNewTagIcon(e.target.value)}
                    placeholder="e.g., fa-mountain"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingTag ? 'Update Tag' : 'Create Tag'}
                  </Button>
                  {editingTag && (
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Posts List - Left Side (1/4 width) */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Existing Posts</h2>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingPost(null);
                    reset();
                  }}
                >
                  Create New
                </Button>
              </div>
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="truncate">{post.title}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditingPost(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Create/Edit Post Form - Right Side (3/4 width) */}
            <Card className="p-6 md:col-span-3">
              <h2 className="text-xl font-semibold mb-4">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <form onSubmit={handleSubmit(editingPost ? handleUpdatePost : handleCreatePost)} className="space-y-4">
                <div>
                  <Label htmlFor="postTitle">Title</Label>
                  <Input
                    id="postTitle"
                    {...register('title')}
                    placeholder="Enter post title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <Label htmlFor="postSlug">Slug</Label>
                  <Input
                    id="postSlug"
                    {...register('slug')}
                    placeholder="Enter post slug"
                  />
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                </div>
                <div>
                  <Label htmlFor="postExcerpt">Excerpt</Label>
                  <Textarea
                    id="postExcerpt"
                    {...register('excerpt')}
                    placeholder="Enter post excerpt"
                  />
                  {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>}
                </div>
                <div>
                  <Label htmlFor="postContent">Content</Label>
                  <Textarea
                    id="postContent"
                    {...register('content')}
                    placeholder="Enter post content"
                    className="min-h-[200px]"
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                </div>
                <div>
                  <Label htmlFor="postImageUrl">Image URL</Label>
                  <Input
                    id="postImageUrl"
                    {...register('imageUrl')}
                    placeholder="Enter image URL"
                  />
                  {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
                </div>
                <div>
                  <Label htmlFor="postAuthor">Author</Label>
                  <Input
                    id="postAuthor"
                    {...register('author')}
                    placeholder="Enter author name"
                  />
                  {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
                </div>
                <div>
                  <Label htmlFor="postDate">Date</Label>
                  <Input
                    id="postDate"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <Label htmlFor="postTag">Tag</Label>
                  <Select
                    value={editingPost?.tagId?.toString() || 'none'}
                    onValueChange={(value) => setValue('tagId', value === 'none' ? null : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="postFeatured"
                    {...register('featured')}
                  />
                  <Label htmlFor="postFeatured">Featured Post</Label>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                  {editingPost && (
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 