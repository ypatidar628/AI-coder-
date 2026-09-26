'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { initialBoardData } from '@/data/dummyData';
import { ColumnItem } from './ColumnItem';
import {
  renameColumn,
  addCard,
  deleteCard,
  moveCard,
} from '@/lib/boardUtils';
import { BoardData } from '@/types/kanban';

const emptySubscribe = () => () => {};

export const KanbanBoard: React.FC = () => {
  const [board, setBoard] = useState<BoardData>(initialBoardData);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setBoard((prev) =>
      moveCard(
        prev,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      )
    );
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setBoard((prev) => renameColumn(prev, columnId, newTitle));
  };

  const handleAddCard = (columnId: string, title: string, details: string) => {
    setBoard((prev) => addCard(prev, columnId, title, details));
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setBoard((prev) => deleteCard(prev, columnId, cardId));
  };

  if (!isMounted) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[600px]">
        <div className="text-sm text-[#888888]">Loading board...</div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="flex-1 p-6 overflow-x-auto min-h-[calc(100vh-66px)] bg-[#f8fafc]">
        <div className="flex items-start gap-5 max-w-full pb-6">
          {board.columns.map((column) => {
            const columnCards = column.cardIds
              .map((id) => board.cards[id])
              .filter(Boolean);

            return (
              <ColumnItem
                key={column.id}
                column={column}
                cards={columnCards}
                onRenameColumn={handleRenameColumn}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
              />
            );
          })}
        </div>
      </main>
    </DragDropContext>
  );
};
