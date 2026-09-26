import { BoardData, Card } from '@/types/kanban';

export function renameColumn(
  board: BoardData,
  columnId: string,
  newTitle: string
): BoardData {
  const trimmed = newTitle.trim();
  if (!trimmed) return board;

  return {
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, title: trimmed } : col
    ),
  };
}

export function addCard(
  board: BoardData,
  columnId: string,
  title: string,
  details: string
): BoardData {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return board;

  const newId = `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newCard: Card = {
    id: newId,
    title: trimmedTitle,
    details: details.trim(),
  };

  return {
    ...board,
    cards: {
      ...board.cards,
      [newId]: newCard,
    },
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, cardIds: [...col.cardIds, newId] } : col
    ),
  };
}

export function deleteCard(
  board: BoardData,
  columnId: string,
  cardId: string
): BoardData {
  const remainingCards = { ...board.cards };
  delete remainingCards[cardId];

  return {
    ...board,
    cards: remainingCards,
    columns: board.columns.map((col) =>
      col.id === columnId
        ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
        : col
    ),
  };
}

export function moveCard(
  board: BoardData,
  sourceColId: string,
  destColId: string,
  sourceIndex: number,
  destIndex: number
): BoardData {
  const sourceCol = board.columns.find((col) => col.id === sourceColId);
  const destCol = board.columns.find((col) => col.id === destColId);

  if (!sourceCol || !destCol) return board;

  if (sourceColId === destColId) {
    const updatedCardIds = [...sourceCol.cardIds];
    const [movedId] = updatedCardIds.splice(sourceIndex, 1);
    if (!movedId) return board;
    updatedCardIds.splice(destIndex, 0, movedId);

    return {
      ...board,
      columns: board.columns.map((col) =>
        col.id === sourceColId ? { ...col, cardIds: updatedCardIds } : col
      ),
    };
  }

  const sourceCardIds = [...sourceCol.cardIds];
  const destCardIds = [...destCol.cardIds];
  const [movedId] = sourceCardIds.splice(sourceIndex, 1);
  if (!movedId) return board;

  destCardIds.splice(destIndex, 0, movedId);

  return {
    ...board,
    columns: board.columns.map((col) => {
      if (col.id === sourceColId) {
        return { ...col, cardIds: sourceCardIds };
      }
      if (col.id === destColId) {
        return { ...col, cardIds: destCardIds };
      }
      return col;
    }),
  };
}
