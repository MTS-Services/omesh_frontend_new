import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const StructureCards = ({ structures, onAdd, onEdit, onDelete }) => {
  console.log('Rendering StructureCards with structures:', structures);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Add Structure</h2>
        <button
          onClick={onAdd}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Add New Structure
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {structures.map((s, i) => (
          <div
            key={s.id || i}
            className={`rounded-xl border bg-white p-5 text-center shadow-sm ${
              i === 0 ? 'border-gray-300' : 'border-gray-100'
            }`}
          >
            <p className="mb-3 text-3xl font-bold text-gray-900">
              {s.minutes}
              {/* <span className="ml-1 text-base font-semibold text-gray-900">Min</span> */}
            </p>
            <p className="mb-5 text-sm leading-relaxed text-gray-500">{s.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(s)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                <Pencil size={13} />
                Edit
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-500 hover:bg-red-100"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StructureCards;
