// components/CustomProjectNode.tsx
import React from 'react';

export function CustomProjectNode({ data }: any) {
  return (
    <div className="relative group bg-white p-3 rounded-xl shadow-lg border border-gray-300 text-sm max-w-[200px] transition-all hover:shadow-xl">
      <div className="font-semibold text-gray-800">{data.label}</div>

      {/* Tooltip */}
      <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded p-2 top-full left-1/2 -translate-x-1/2 mt-2 w-64">
        <div>{data.description}</div>
        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300 block mt-1"
          >
            Visit Project →
          </a>
        )}
      </div>
    </div>
  );
}