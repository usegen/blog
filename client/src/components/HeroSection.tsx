import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPostWithTag } from '@shared/schema';

const HeroSection: React.FC = () => {
  const { data: featuredPost, isLoading } = useQuery<BlogPostWithTag>({
    queryKey: ['/api/posts/featured'],
  });

  return (
    <section className="hero-section relative overflow-hidden">
      <div className="container mx-auto py-16 px-4 md:py-24 lg:py-32">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-6">
            Discover Romania <span className="text-secondary">With Me</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Explore the hidden gems, breathtaking landscapes, and rich cultural heritage of Romania through my personal journey.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 z-10">
            {isLoading ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 animate-pulse h-[400px] md:h-[500px]"></div>
            ) : featuredPost ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title} 
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 article-overlay">
                  <span className="bg-secondary text-white py-1 px-3 rounded-full text-sm font-semibold">Featured</span>
                  <h3 className="text-white font-display text-2xl mt-2">{featuredPost.title}</h3>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 flex items-center justify-center h-[400px] md:h-[500px]">
                <p className="text-gray-500">No featured post available</p>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2 relative ml-auto pl-0 md:pl-8 mt-8 md:mt-0">
            <h2 className="font-display text-2xl font-bold text-primary mb-4">Featured Post</h2>
            <p className="text-gray-600 mb-6">
              Discover my handpicked favorite destinations and experiences throughout beautiful Romania.
            </p>
            <p className="text-gray-600">
              Each featured post highlights extraordinary places with detailed guides, insider tips, and breathtaking photography to inspire your Romanian adventure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
