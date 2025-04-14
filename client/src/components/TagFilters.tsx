import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-4 py-2 text-base md:text-lg transition-colors",
            selectedTagIds.includes(tag.id)
              ? "bg-primary text-white hover:bg-primary/90"
              : "border-primary text-primary hover:bg-primary/10"
          )}
          onClick={() => handleTagClick(tag.id)}
        >
          <span className="mr-2"><i className={`fas ${tag.icon}`}></i></span>
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};

export default TagFilters;
