import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Bookmark, Globe, AlertCircle } from 'lucide-react';
import { PageMetadata, ContentType, User, SavedContent } from '../../types';
import { CategorySelect } from './CategorySelect';
import { TagSelector } from './TagSelector';
import { DuplicateBanner } from './DuplicateBanner';
import { ContentService } from '../../services/content';
import { OfflineService } from '../../services/offline';

interface SaveTabFormProps {
  metadata: PageMetadata;
  initialCategory: ContentType;
  user: User;
  isOnline: boolean;
  onSavedSuccess?: () => void;
}

export const SaveTabForm: React.FC<SaveTabFormProps> = ({
  metadata,
  initialCategory,
  user,
  isOnline,
  onSavedSuccess,
}) => {
  const [title, setTitle] = useState(metadata.title);
  const [category, setCategory] = useState<ContentType>(initialCategory);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [notes, setNotes] = useState(metadata.description || '');
  const [existingContent, setExistingContent] = useState<SavedContent | null>(null);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Check duplicate URL
    ContentService.checkDuplicate(metadata.url, user.id).then((found) => {
      setExistingContent(found);
    });
  }, [metadata.url, user.id]);

  const handleSummarize = async () => {
    setSummarizing(true);
    setFormError(null);
    try {
      const summaryText = await ContentService.summarizeUrl(metadata.url);
      setNotes((prev) => (prev ? `${prev}\n\n🤖 AI Summary:\n${summaryText}` : `🤖 AI Summary:\n${summaryText}`));
    } catch (err: any) {
      setFormError(err.message || 'AI Summarization failed for this page');
    } finally {
      setSummarizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Title cannot be empty');
      return;
    }

    setSaving(true);
    const payload = {
      link: metadata.url,
      type: category,
      title: title.trim(),
      description: notes.trim() || title.trim(),
      tags: selectedTagIds,
      userId: user.id,
    };

    try {
      if (isOnline) {
        await ContentService.saveContent(payload);
      } else {
        await OfflineService.enqueue(payload);
      }
      setSavedSuccess(true);
      if (onSavedSuccess) onSavedSuccess();
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.close) {
          window.close();
        }
      }, 1500);
    } catch (err: any) {
      // Fallback offline queue on network error
      try {
        await OfflineService.enqueue(payload);
        setSavedSuccess(true);
        setFormError('Network error. Enqueued offline for automatic sync.');
      } catch (offlineErr: any) {
        setFormError(err.message || 'Failed to save webpage');
      }
    } finally {
      setSaving(false);
    }
  };

  if (savedSuccess) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 h-[380px]">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg animate-bounce">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          ✔ Saved Successfully!
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[240px]">
          Added to your SecondBrain database. Closing window...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
      {existingContent && <DuplicateBanner existingContent={existingContent} />}

      {formError && (
        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start space-x-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Tab Preview Card */}
      <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-darkBorder flex items-start space-x-2.5">
        {metadata.favicon ? (
          <img
            src={metadata.favicon}
            alt="favicon"
            className="w-4 h-4 mt-0.5 rounded flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Globe className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[10px] font-semibold text-brain-600 dark:text-indigo-400 bg-brain-50 dark:bg-brain-900/50 px-1.5 py-0.5 rounded mb-1">
            {metadata.hostname}
          </span>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
            {metadata.url}
          </p>
        </div>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-darkBorder bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brain-500 focus:outline-none transition"
        />
      </div>

      {/* Category Picker */}
      <CategorySelect selected={category} onChange={setCategory} />

      {/* Tags Selector */}
      <TagSelector selectedTagIds={selectedTagIds} onChange={setSelectedTagIds} />

      {/* Notes & AI Summarize */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Notes / Summary
          </label>
          <button
            type="button"
            disabled={summarizing}
            onClick={handleSummarize}
            className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center space-x-1 transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${summarizing ? 'animate-spin' : ''}`} />
            <span>{summarizing ? 'Summarizing...' : 'AI Summarize'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add optional notes or let AI summarize..."
          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-darkBorder bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brain-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 px-4 rounded-lg bg-brain-600 hover:bg-brain-700 active:bg-brain-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition disabled:opacity-50"
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            <span>Save to SecondBrain</span>
          </>
        )}
      </button>
    </form>
  );
};
