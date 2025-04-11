import React from 'react';
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <div className="w-full md:w-[70%] mx-auto mb-10 transition-all duration-300 rounded-full overflow-hidden bg-white shadow-lg border border-gray-200 focus-within:shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-20">
      <div className="flex items-center px-4 py-3">
        <i className="fas fa-search text-gray-400 mr-3"></i>
        <Input 
          type="text" 
          placeholder="Search for destinations, activities, or stories..." 
          className="w-full border-0 outline-none bg-transparent text-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;
