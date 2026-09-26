'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2 } from 'lucide-react';
import { Card } from '@/types/kanban';

interface CardItemProps {
  card: Card;
  index: number;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  index,
  columnId,
  onDelete,
}) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-testid={`card-${card.id}`}
          className={`group relative p-3.5 mb-2.5 bg-white rounded-lg border transition-all duration-150 ${
            snapshot.isDragging
              ? 'shadow-lg border-[#209dd7] ring-2 ring-[#209dd7]/20 rotate-1'
              : 'border-slate-200/80 shadow-xs hover:border-[#209dd7]/60 hover:shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <h4
              data-testid={`card-title-${card.id}`}
              className="text-sm font-semibold text-[#032147] tracking-tight leading-snug break-words flex-1"
            >
              {card.title}
            </h4>
            <button
              type="button"
              data-testid={`delete-card-${card.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(columnId, card.id);
              }}
              title="Delete card"
              aria-label={`Delete ${card.title}`}
              className="text-slate-400 hover:text-red-500 opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {card.details && (
            <p
              data-testid={`card-details-${card.id}`}
              className="text-xs text-[#888888] mt-1.5 leading-relaxed break-words whitespace-pre-wrap"
            >
              {card.details}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
};
