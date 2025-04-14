import React, { useState, useEffect, useMemo } from 'react';
import SearchAndFilterSection from '@/components/SearchAndFilterSection';
import BlogPostGrid from '@/components/BlogPostGrid';
import Newsletter from '@/components/Newsletter';
import { useQuery } from '@tanstack/react-query';
import { BlogPostWithTag } from '@shared/schema';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle tag selection (toggle)
  const handleTagSelect = (tagId: number) => {
    setSelectedTagIds(prev => {
      // If tag is already selected, remove it
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } 
      // Otherwise add it to the selection
      return [...prev, tagId];
    });
  };

  // Fetch all blog posts
  const { data: allPosts, isLoading: isLoadingAllPosts } = useQuery<BlogPostWithTag[]>({
    queryKey: ['/api/posts'],
  });

  // Fetch posts by search query
  const { data: searchPosts, isLoading: isLoadingSearchPosts } = useQuery<BlogPostWithTag[]>({
    queryKey: ['/api/posts/search', { q: debouncedSearchQuery }],
    queryFn: async () => {
      if (!debouncedSearchQuery) return [];
      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: debouncedSearchQuery !== '',
  });

  // Filter posts based on selected tags
  const filteredPosts = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];
    if (selectedTagIds.length === 0) return allPosts;
    
    // Include posts that match ANY of the selected tags (inclusive filtering)
    return allPosts.filter(post => selectedTagIds.includes(post.tag.id));
  }, [allPosts, selectedTagIds]);

  // Determine which posts to display
  const displayPosts = useMemo(() => {
    if (debouncedSearchQuery) {
      // If both search and tags are active, filter search results by tags
      if (selectedTagIds.length > 0 && searchPosts) {
        return searchPosts.filter(post => selectedTagIds.includes(post.tag.id));
      }
      return searchPosts || [];
    }
    
    return filteredPosts;
  }, [debouncedSearchQuery, selectedTagIds, searchPosts, filteredPosts]);

  const isLoading = isLoadingAllPosts || isLoadingSearchPosts;

  return (
    <>
      <SearchAndFilterSection 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        selectedTagIds={selectedTagIds} 
        onTagSelect={handleTagSelect} 
      />
      <BlogPostGrid posts={displayPosts} isLoading={isLoading} />
      
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8">About</h2>
          <p className="text-lg text-gray-600">
            As a Mikulov castle tour guide who made Romania my home, I bring a unique perspective to exploring this fascinating country. Through my blog, I share authentic experiences, hidden gems, and cultural insights that only a local resident can provide.
          </p>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
};

export default Home;
