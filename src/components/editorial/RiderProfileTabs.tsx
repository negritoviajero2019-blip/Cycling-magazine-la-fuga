'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

export function RiderProfileTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id)

  return (
    <div className="mt-10">
      <div className="flex gap-1 overflow-x-auto border-b border-border" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              active === tab.id ? 'border-lime text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6">{tabs.find((tab) => tab.id === active)?.content}</div>
    </div>
  )
}
