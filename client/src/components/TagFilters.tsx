import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@shared/schema';
import { Button } from "@/components/ui/button";

interface TagFiltersProps {
  selectedTagIds: number[];
  onTagSelect: (tagId: number) => void;
}

const TagFilters: React.FC<TagFiltersProps> = ({ selectedTagIds, onTagSelect }) => {
  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const handleTagClick = (tagId: number) => {
    onTagSelect(tagId); // Toggle the tag in the parent component
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 w-24 rounded-full bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <Button
              key={tag.id}
              variant="outline"
              className={`tag-pill whitespace-nowrap px-4 py-2 rounded-full border border-primary font-semibold text-sm transition-colors duration-200 shadow-sm hover:shadow-md ${
                isSelected 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-primary hover:bg-primary hover:text-white'
              }`}
              onClick={() => handleTagClick(tag.id)}
            >
              <span className="mr-1"><i className={`fas ${tag.icon}`}></i></span>
              {tag.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TagFilters;
