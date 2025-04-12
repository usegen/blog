import React from 'react';
import SearchBox from './SearchBox';
import TagFilters from './TagFilters';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  const searchRef = React.useRef<HTMLDivElement>(null);

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
        }, 3000);
      }
    }, 100);

    return () => {
      if (typingInterval) clearInterval(typingInterval);
    };
  }, []);

  const scrollToSearch = () => {
    if (searchRef.current) {
      const element = searchRef.current;
      const headerHeight = 80; // Approximate height of the header/navigation
      const y = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="search-filter-section bg-gradient-to-b from-white to-gray-50 py-8 md:py-24 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-6 md:mb-10">
          <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-primary leading-tight mb-4 md:mb-6">
            <span>{displayText}</span>
            {showCursor && <span className="animate-blink">|</span>}
          </h1>
          <p className="hidden md:block text-lg md:text-xl mb-10 text-gray-700 max-w-3xl mx-auto">
            A Mikulov castle tour guide that moved here years ago.
          </p>
        </div>
        <div className="max-w-3xl mx-auto" ref={searchRef}>
          <SearchBox value={searchQuery} onChange={onSearchChange} onFocus={scrollToSearch} />
          
          {/* Mobile Accordion for Tags */}
          <div className="md:hidden mt-2">
            <Accordion type="single" collapsible className="border-none" onValueChange={scrollToSearch}>
              <AccordionItem value="tags" className="border-none">
                <AccordionTrigger className="text-primary font-semibold text-lg [&>svg]:h-6 [&>svg]:w-6">
                  Filter by Tags
                </AccordionTrigger>
                <AccordionContent>
                  <TagFilters selectedTagIds={selectedTagIds} onTagSelect={onTagSelect} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop Tags */}
          <div className="hidden md:block mt-8">
            <TagFilters selectedTagIds={selectedTagIds} onTagSelect={onTagSelect} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilterSection;