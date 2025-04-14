import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, onFocus }) => {
  return (
    <div className="w-full max-w-7xl mx-auto mb-8 transition-all duration-300 rounded-full overflow-hidden bg-white shadow-xl border-2 border-gray-200 focus-within:shadow-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-20">
      <div className="flex items-center px-4 py-3 md:px-6 md:py-4 lg:px-6 lg:py-4 2xl:px-8 2xl:py-6">
        <Search className="text-gray-400 mr-4 h-5 w-5 md:mr-5 md:h-5 md:w-5 lg:mr-5 lg:h-5 lg:w-5 2xl:mr-6 2xl:h-6 2xl:w-6" />
        <Input
          type="text"
          placeholder="What attracts you to Romania?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="w-full border-0 outline-none bg-transparent text-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base md:text-lg lg:text-lg 2xl:text-xl"
        />
      </div>
    </div>
  );
};

export default SearchBox;
