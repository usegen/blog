import React from 'react';
import SearchBox from './SearchBox';
import TagFilters from './TagFilters';

interface SearchAndFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTagId: number | null;
  onTagSelect: (tagId: number | null) => void;
}

const SearchAndFilterSection: React.FC<SearchAndFilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedTagId,
  onTagSelect
}) => {
  return (
    <section className="search-filter-section bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-6">
            Discover Romania <span className="text-secondary">With Me</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-700 max-w-3xl mx-auto">
            Explore the hidden gems, breathtaking landscapes, and rich cultural heritage of Romania through my personal journey.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <SearchBox value={searchQuery} onChange={onSearchChange} />
          <div className="mt-8">
            <TagFilters selectedTagId={selectedTagId} onTagSelect={onTagSelect} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilterSection;