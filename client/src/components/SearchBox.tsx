import React from 'react';
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 transition-all duration-300 rounded-full overflow-hidden bg-white shadow-xl border-2 border-gray-200 focus-within:shadow-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-20">
      <div className="flex items-center px-6 py-4">
        <i className="fas fa-search text-gray-400 mr-4 text-xl"></i>
        <Input 
          type="text" 
          placeholder="What attracts you to Romania?" 
          className="w-full border-0 outline-none bg-transparent text-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;
