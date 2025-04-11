import React, { useState, useEffect } from 'react';
import SearchAndFilterSection from '@/components/SearchAndFilterSection';
import BlogPostGrid from '@/components/BlogPostGrid';
import Newsletter from '@/components/Newsletter';
import { useQuery } from '@tanstack/react-query';
import { BlogPostWithTag } from '@shared/schema';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch all blog posts
  const { data: allPosts, isLoading: isLoadingAllPosts } = useQuery<BlogPostWithTag[]>({
    queryKey: ['/api/posts'],
  });

  // Fetch posts by tag
  const { data: tagPosts, isLoading: isLoadingTagPosts } = useQuery<BlogPostWithTag[]>({
    queryKey: ['/api/posts/by-tag', selectedTagId],
    enabled: selectedTagId !== null,
  });

  // Fetch posts by search query
  const { data: searchPosts, isLoading: isLoadingSearchPosts } = useQuery<BlogPostWithTag[]>({
    queryKey: ['/api/posts/search', { q: debouncedSearchQuery }],
    enabled: debouncedSearchQuery !== '',
  });

  // Determine which posts to display
  const displayPosts = React.useMemo(() => {
    if (debouncedSearchQuery) {
      return searchPosts || [];
    }
    if (selectedTagId !== null) {
      return tagPosts || [];
    }
    return allPosts || [];
  }, [debouncedSearchQuery, selectedTagId, searchPosts, tagPosts, allPosts]);

  const isLoading = isLoadingAllPosts || isLoadingTagPosts || isLoadingSearchPosts;

  return (
    <>
      <SearchAndFilterSection 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        selectedTagId={selectedTagId} 
        onTagSelect={setSelectedTagId} 
      />
      <BlogPostGrid posts={displayPosts} isLoading={isLoading} />
      <Newsletter />
    </>
  );
};

export default Home;
