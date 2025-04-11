import React from 'react';
import { Link } from 'wouter';
import { BlogPostWithTag } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPostWithTag;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formattedDate = format(new Date(post.date), 'MMM d, yyyy');

  return (
    <Link href={`/article/${post.id}`}>
      <Card className="article-card bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl cursor-pointer h-full">
        <div className="relative">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-52 object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {post.tag.name}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="font-display text-xl font-bold text-primary mb-2">{post.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <i className="fas fa-user"></i>
              </div>
              <span className="text-sm text-gray-600">{post.author}</span>
            </div>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogPostCard;
