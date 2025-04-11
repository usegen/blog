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
    <section className="search-filter-section bg-gray-50 py-10 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <SearchBox value={searchQuery} onChange={onSearchChange} />
          <TagFilters selectedTagId={selectedTagId} onTagSelect={onTagSelect} />
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilterSection;