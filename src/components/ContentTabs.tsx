'use client';

import { useMemo, useState, type ReactNode } from 'react';

type ContentTab = {
  id: string;
  label: string;
  content: ReactNode;
};

type ContentTabsProps = {
  tabs: ContentTab[];
};

const ContentTabs = ({ tabs }: ContentTabsProps) => {
  const initialTabId = useMemo(() => tabs[0]?.id ?? '', [tabs]);
  const [activeTabId, setActiveTabId] = useState(initialTabId);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (!tabs.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-full border border-zinc-200 bg-white p-1 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={[
                'rounded-full px-4 py-2 font-semibold transition',
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  );
};

export default ContentTabs;
