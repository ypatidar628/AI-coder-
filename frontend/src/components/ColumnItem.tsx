'use client';

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Edit2, Check } from 'lucide-react';
import { CardItem } from './CardItem';
import { AddCardModal } from './AddCardModal';
import { Card, Column } from '@/types/kanban';

interface ColumnItemProps {
  column: Column;
  cards: Card[];
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

export const ColumnItem: React.FC<ColumnItemProps> = ({
  column,
  cards,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const startEditing = () => {
    setTitleValue(column.title);
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setTitleValue(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitleValue(column.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      data-testid={`column-${column.id}`}
      className="flex flex-col w-72 shrink-0 bg-slate-100/80 rounded-xl border border-slate-200/90 shadow-xs"
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="text"
                autoFocus
                data-testid={`column-title-input-${column.id}`}
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-semibold text-[#032147] bg-white border border-[#209dd7] rounded px-2 py-0.5 outline-hidden shadow-xs"
              />
              <button
                type="button"
                onClick={handleTitleSubmit}
                aria-label="Save column title"
                className="text-[#209dd7] hover:text-[#032147] p-1"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 cursor-pointer group flex-1 min-w-0"
              onClick={startEditing}
              title="Click to rename column"
            >
              <h3
                data-testid={`column-title-${column.id}`}
                className="text-sm font-semibold text-[#032147] tracking-tight truncate group-hover:text-[#209dd7] transition-colors"
              >
                {column.title}
              </h3>
              <Edit2
                size={12}
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </div>
          )}

          <span
            data-testid={`column-count-${column.id}`}
            className="text-[11px] font-semibold text-[#888888] bg-white px-2 py-0.5 rounded-full border border-slate-200/80 shrink-0"
          >
            {cards.length}
          </span>
        </div>

        <button
          type="button"
          data-testid={`add-card-button-${column.id}`}
          onClick={() => setIsAddModalOpen(true)}
          aria-label={`Add card to ${column.title}`}
          className="text-slate-500 hover:text-[#753991] hover:bg-white p-1 rounded-md transition-all shrink-0"
          title="Add new card"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Droppable Card List */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            data-testid={`droppable-${column.id}`}
            className={`flex-1 p-3 min-h-[140px] transition-colors duration-150 ${
              snapshot.isDraggingOver ? 'bg-[#209dd7]/5' : ''
            }`}
          >
            {cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                columnId={column.id}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddModalOpen}
        columnTitle={column.title}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(title, details) => onAddCard(column.id, title, details)}
      />
    </div>
  );
};
