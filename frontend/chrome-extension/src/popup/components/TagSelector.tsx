import React, { useState, useEffect } from 'react';
import { Tag as TagIcon, Plus, X, Check } from 'lucide-react';
import { Tag } from '../../types';
import { ContentService } from '../../services/content';

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTagIds, onChange }) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagTitle, setNewTagTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const loadTags = async () => {
    try {
      const tags = await ContentService.fetchAllTags();
      setAvailableTags(tags);
    } catch (err) {
      console.warn('Failed to load tags:', err);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagTitle.trim()) return;
    setLoading(true);
    try {
      const title = newTagTitle.trim();
      await ContentService.createTag(title);
      setNewTagTitle('');
      setShowInput(false);
      await loadTags();
    } catch (err) {
      console.warn('Could not create tag:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-1">
          <TagIcon className="w-3.5 h-3.5 text-brain-500" />
          <span>Tags</span>
        </label>
        <button
          type="button"
          onClick={() => setShowInput(!showInput)}
          className="text-[11px] font-medium text-brain-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
        >
          <Plus className="w-3 h-3" />
          <span>New Tag</span>
        </button>
      </div>

      {showInput && (
        <div className="flex items-center space-x-1.5 mb-2">
          <input
            type="text"
            value={newTagTitle}
            onChange={(e) => setNewTagTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateTag();
              }
            }}
            placeholder="Tag name..."
            className="flex-1 px-2.5 py-1 text-xs rounded border border-gray-200 dark:border-darkBorder bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brain-500"
          />
          <button
            type="button"
            disabled={loading || !newTagTitle.trim()}
            onClick={handleCreateTag}
            className="p-1 rounded bg-brain-600 text-white hover:bg-brain-700 disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="p-1 rounded bg-gray-100 dark:bg-slate-700 text-gray-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
        {availableTags.length === 0 ? (
          <p className="text-[11px] text-gray-400 italic">No tags available. Add your first tag!</p>
        ) : (
          availableTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag._id);
            return (
              <button
                key={tag._id}
                type="button"
                onClick={() => toggleTag(tag._id)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-brain-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                #{tag.title}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
