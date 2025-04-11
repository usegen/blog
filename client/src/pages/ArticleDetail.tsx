import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { BlogPostWithTag } from '@shared/schema';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ArticleDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = parseInt(params.id);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [post, setPost] = useState<BlogPostWithTag | null>(null);
  
  useEffect(() => {
    if (isNaN(id)) {
      setLoading(false);
      setError(true);
      return;
    }
    
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching post: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received post data:", data);
        setPost(data);
        setError(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  if (isNaN(id)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-display font-bold text-primary mb-4">Invalid Article ID</h1>
          <p className="text-gray-600 mb-6">The article ID you're trying to access is invalid.</p>
          <Button 
            onClick={() => setLocation('/')}
            className="bg-primary text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gray-200 h-[500px] w-full rounded-xl animate-pulse mb-8"></div>
        <div className="bg-gray-200 h-8 w-1/2 rounded animate-pulse mb-4"></div>
        <div className="bg-gray-200 h-4 w-full rounded animate-pulse mb-2"></div>
        <div className="bg-gray-200 h-4 w-full rounded animate-pulse mb-2"></div>
        <div className="bg-gray-200 h-4 w-3/4 rounded animate-pulse"></div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-display font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => setLocation('/')}
            className="bg-primary text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Safely format the date, handling it as a string if it's not already a Date object
  let formattedDate;
  try {
    // Try to format the date whether it's a Date object or a string
    formattedDate = format(new Date(post.date), 'MMMM d, yyyy');
  } catch (error) {
    // Fallback to displaying the date as-is if there's a formatting error
    formattedDate = typeof post.date === 'string' ? post.date : 'Unknown date';
  }
  
  return (
    <article className="pt-8 pb-16">
      <div className="container mx-auto px-4">
        <Button 
          variant="outline"
          className="mb-8 flex items-center gap-2"
          onClick={() => setLocation('/')}
        >
          <ArrowLeft size={16} />
          Back to all articles
        </Button>
        
        <div className="relative rounded-xl overflow-hidden mb-8 h-[300px] md:h-[500px]">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Badge className="bg-accent text-primary mb-4">
            {post.tag?.name || 'Uncategorized'}
          </Badge>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-8 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <i className="fas fa-user"></i>
              </div>
              <span>{post.author}</span>
            </div>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {post.content?.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-6">{paragraph}</p>
            )) || <p>No content available</p>}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
