import { describe, it, expect } from 'vitest';
import { initialBoardData } from '@/data/dummyData';
import {
  renameColumn,
  addCard,
  deleteCard,
  moveCard,
} from './boardUtils';

describe('boardUtils', () => {
  it('renames a column correctly', () => {
    const updated = renameColumn(initialBoardData, 'column-1', 'Incoming Tasks');
    expect(updated.columns[0].title).toBe('Incoming Tasks');
    expect(updated.columns[1].title).toBe('Ready');
  });

  it('ignores empty column title rename', () => {
    const updated = renameColumn(initialBoardData, 'column-1', '   ');
    expect(updated.columns[0].title).toBe('Backlog');
  });

  it('adds a card to a column', () => {
    const updated = addCard(
      initialBoardData,
      'column-1',
      'New Task Item',
      'Task details here'
    );
    const col1 = updated.columns.find((col) => col.id === 'column-1')!;
    expect(col1.cardIds.length).toBe(initialBoardData.columns[0].cardIds.length + 1);

    const newCardId = col1.cardIds[col1.cardIds.length - 1];
    expect(updated.cards[newCardId]).toBeDefined();
    expect(updated.cards[newCardId].title).toBe('New Task Item');
    expect(updated.cards[newCardId].details).toBe('Task details here');
  });

  it('does not add card with empty title', () => {
    const updated = addCard(initialBoardData, 'column-1', '  ', 'details');
    expect(updated).toBe(initialBoardData);
  });

  it('deletes a card from board and column', () => {
    const cardToDelete = 'card-1';
    const updated = deleteCard(initialBoardData, 'column-1', cardToDelete);
    const col1 = updated.columns.find((col) => col.id === 'column-1')!;

    expect(col1.cardIds.includes(cardToDelete)).toBe(false);
    expect(updated.cards[cardToDelete]).toBeUndefined();
  });

  it('moves a card within the same column', () => {
    const updated = moveCard(initialBoardData, 'column-1', 'column-1', 0, 1);
    const col1 = updated.columns.find((col) => col.id === 'column-1')!;

    expect(col1.cardIds).toEqual(['card-2', 'card-1']);
  });

  it('moves a card across columns', () => {
    const updated = moveCard(initialBoardData, 'column-1', 'column-2', 0, 0);
    const col1 = updated.columns.find((col) => col.id === 'column-1')!;
    const col2 = updated.columns.find((col) => col.id === 'column-2')!;

    expect(col1.cardIds).toEqual(['card-2']);
    expect(col2.cardIds).toEqual(['card-1', 'card-3']);
  });
});
