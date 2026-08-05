import React from 'react';
import { Link2, FileText, Video, Twitter, Bookmark } from 'lucide-react';
import { ContentType } from '../../types';

interface CategorySelectProps {
  selected: ContentType;
  onChange: (category: ContentType) => void;
}

const CATEGORIES: { id: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'link', label: 'Link', icon: Link2 },
  { id: 'article', label: 'Article', icon: FileText },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'tweet', label: 'Tweet', icon: Twitter },
  { id: 'custom', label: 'Custom', icon: Bookmark },
];

export const CategorySelect: React.FC<CategorySelectProps> = ({ selected, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        Category
      </label>
      <div className="grid grid-cols-5 gap-1.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selected === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-[11px] font-medium transition-all ${
                isSelected
                  ? 'bg-brain-50 dark:bg-brain-900/40 border-brain-500 text-brain-600 dark:text-indigo-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-darkBorder text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 mb-1 ${isSelected ? 'text-brain-600 dark:text-indigo-300' : 'text-gray-400'}`} />
              <span className="truncate w-full text-center">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
