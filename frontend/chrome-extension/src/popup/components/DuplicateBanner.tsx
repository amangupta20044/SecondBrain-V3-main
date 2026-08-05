import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { SavedContent } from '../../types';

interface DuplicateBannerProps {
  existingContent: SavedContent;
}

export const DuplicateBanner: React.FC<DuplicateBannerProps> = ({ existingContent }) => {
  return (
    <div className="mb-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start space-x-2 text-amber-800 dark:text-amber-300">
      <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <div className="flex-1 text-xs">
        <p className="font-semibold">Already saved in SecondBrain!</p>
        <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 line-clamp-1">
          Saved as: "{existingContent.title}"
        </p>
      </div>
    </div>
  );
};
