'use client';

import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends { _id: string }>({ 
  columns, 
  data, 
  loading, 
  onRowClick,
  emptyMessage = 'No data found.'
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-[#111] border border-white/5 rounded-xl">
        <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
          Loading Data...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-[#111] border border-white/5 rounded-xl text-gray-500">
        <p className="text-xs uppercase tracking-widest font-bold">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (col.accessor ? (item[col.accessor] as ReactNode) : null)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
