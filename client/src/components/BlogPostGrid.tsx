import React, { useState } from 'react';
import BlogPostCard from './BlogPostCard';
import { BlogPostWithTag } from '@shared/schema';
import { Button } from "@/components/ui/button";

interface BlogPostGridProps {
  posts: BlogPostWithTag[];
  isLoading: boolean;
}

const BlogPostGrid: React.FC<BlogPostGridProps> = ({ posts, isLoading }) => {
  const [visiblePosts, setVisiblePosts] = useState(6);
  
  const handleLoadMore = () => {
    setVisiblePosts(prevCount => prevCount + 6);
  };
  
  if (isLoading) {
    return (
      <section className="container mx-auto py-12 px-4">
        <h2 className="font-display text-3xl font-bold text-primary mb-8">Latest Adventures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-200 rounded-xl overflow-hidden shadow-lg h-[350px] animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }
  
  if (!posts || posts.length === 0) {
    return (
      <section className="container mx-auto py-12 px-4">
        <h2 className="font-display text-3xl font-bold text-primary mb-8">Latest Adventures</h2>
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500 text-lg">No blog posts found. Please try a different search or tag filter.</p>
        </div>
      </section>
    );
  }
  
  const displayPosts = posts.slice(0, visiblePosts);
  const hasMorePosts = posts.length > visiblePosts;
  
  return (
    <section className="container mx-auto py-12 px-4">
      <h2 className="font-display text-3xl font-bold text-primary mb-8">Latest Adventures</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayPosts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      
      {hasMorePosts && (
        <div className="mt-12 text-center">
          <Button 
            onClick={handleLoadMore}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md"
          >
            Load More Stories
          </Button>
        </div>
      )}
    </section>
  );
};

export default BlogPostGrid;
