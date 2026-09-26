import { BoardData } from '@/types/kanban';

export const initialBoardData: BoardData = {
  columns: [
    {
      id: 'column-1',
      title: 'Backlog',
      cardIds: ['card-1', 'card-2'],
    },
    {
      id: 'column-2',
      title: 'Ready',
      cardIds: ['card-3'],
    },
    {
      id: 'column-3',
      title: 'In Progress',
      cardIds: ['card-4', 'card-5'],
    },
    {
      id: 'column-4',
      title: 'In Review',
      cardIds: ['card-6'],
    },
    {
      id: 'column-5',
      title: 'Done',
      cardIds: ['card-7', 'card-8'],
    },
  ],
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Feedback Analysis',
      details: 'Review quarterly client feedback and aggregate priority themes.',
    },
    'card-2': {
      id: 'card-2',
      title: 'Query Optimization',
      details: 'Analyze slow query logs and add composite indexes where necessary.',
    },
    'card-3': {
      id: 'card-3',
      title: 'API Rate Limiting',
      details: 'Implement token bucket algorithm for public endpoint protection.',
    },
    'card-4': {
      id: 'card-4',
      title: 'Kanban Board Interface',
      details: 'Develop drag and drop column layout using Tailwind and Next.js.',
    },
    'card-5': {
      id: 'card-5',
      title: 'Design System Tokens',
      details: 'Ensure exact color scheme matching brand specification guidelines.',
    },
    'card-6': {
      id: 'card-6',
      title: 'Automated Test Coverage',
      details: 'Write comprehensive unit tests for column mutations and card actions.',
    },
    'card-7': {
      id: 'card-7',
      title: 'Project Scaffolding',
      details: 'Bootstrap Next.js repository with TypeScript and ESLint configuration.',
    },
    'card-8': {
      id: 'card-8',
      title: 'Repository Setup',
      details: 'Configure version control rules, branch protections, and gitignore.',
    },
  },
};
