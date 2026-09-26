import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { CardItem } from '../CardItem';
import { AddCardModal } from '../AddCardModal';
import { ColumnItem } from '../ColumnItem';
import { KanbanBoard } from '../KanbanBoard';
import { Card, Column } from '@/types/kanban';

describe('CardItem', () => {
  const sampleCard: Card = {
    id: 'test-card-1',
    title: 'Test Card Title',
    details: 'Test Card Details Description',
  };

  it('renders card title and details', () => {
    const onDelete = vi.fn();
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="col-1">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <CardItem
                card={sampleCard}
                index={0}
                columnId="col-1"
                onDelete={onDelete}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );

    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Test Card Details Description')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="col-1">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <CardItem
                card={sampleCard}
                index={0}
                columnId="col-1"
                onDelete={onDelete}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );

    const deleteBtn = screen.getByTestId('delete-card-test-card-1');
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('col-1', 'test-card-1');
  });
});

describe('AddCardModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <AddCardModal
        isOpen={false}
        columnTitle="Backlog"
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders dialog and submits title and details', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Backlog"
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Add Card to Backlog')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Card Title/i);
    const detailsInput = screen.getByLabelText(/Card Details/i);
    const submitBtn = screen.getByTestId('submit-card-button');

    fireEvent.change(titleInput, { target: { value: 'New Test Card' } });
    fireEvent.change(detailsInput, { target: { value: 'New Test Details' } });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith('New Test Card', 'New Test Details');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('ColumnItem', () => {
  const sampleColumn: Column = {
    id: 'col-1',
    title: 'Backlog',
    cardIds: ['c1'],
  };
  const sampleCards: Card[] = [
    { id: 'c1', title: 'Task 1', details: 'Details 1' },
  ];

  it('renders column title and card count', () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <ColumnItem
          column={sampleColumn}
          cards={sampleCards}
          onRenameColumn={() => {}}
          onAddCard={() => {}}
          onDeleteCard={() => {}}
        />
      </DragDropContext>
    );

    expect(screen.getByTestId('column-title-col-1')).toHaveTextContent('Backlog');
    expect(screen.getByTestId('column-count-col-1')).toHaveTextContent('1');
  });

  it('allows renaming column title inline', () => {
    const onRename = vi.fn();
    render(
      <DragDropContext onDragEnd={() => {}}>
        <ColumnItem
          column={sampleColumn}
          cards={sampleCards}
          onRenameColumn={onRename}
          onAddCard={() => {}}
          onDeleteCard={() => {}}
        />
      </DragDropContext>
    );

    const titleEl = screen.getByTestId('column-title-col-1');
    fireEvent.click(titleEl);

    const input = screen.getByTestId('column-title-input-col-1');
    fireEvent.change(input, { target: { value: 'Prioritized Backlog' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onRename).toHaveBeenCalledWith('col-1', 'Prioritized Backlog');
  });
});

describe('KanbanBoard', () => {
  it('renders 5 columns with dummy data cards', async () => {
    render(<KanbanBoard />);

    // Since hasMounted sets to true on useEffect, check columns appear
    expect(await screen.findByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Check dummy cards rendered
    expect(screen.getByText('Feedback Analysis')).toBeInTheDocument();
    expect(screen.getByText('Query Optimization')).toBeInTheDocument();
  });
});
