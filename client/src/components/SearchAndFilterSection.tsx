import React from 'react';
import SearchBox from './SearchBox';
import TagFilters from './TagFilters';

interface SearchAndFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTagIds: number[];
  onTagSelect: (tagId: number) => void;
}

const SearchAndFilterSection: React.FC<SearchAndFilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedTagIds,
  onTagSelect
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [showCursor, setShowCursor] = React.useState(true);
  const fullText = 'Discover Romania With Me';

  React.useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowCursor(false);
        }, 5000);
      }
    }, 100);

    return () => {
      if (typingInterval) clearInterval(typingInterval);
    };
  }, []);

  return (
    <section className="search-filter-section bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-6">
            <span>{displayText}</span>
            {showCursor && <span className="animate-blink">|</span>}
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-700 max-w-3xl mx-auto">
            Find out everything from a Mikulov castle tour guide that moved here years ago.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <SearchBox value={searchQuery} onChange={onSearchChange} />
          <div className="mt-8">
            <TagFilters selectedTagIds={selectedTagIds} onTagSelect={onTagSelect} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilterSection;