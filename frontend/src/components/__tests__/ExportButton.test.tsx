import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportButton from '../ExportButton';
import { Task } from '../../types';

const mockTasks: Task[] = [
  { id: 1, title: 'Buy groceries', completed: false, createdAt: '2026-04-20T10:00:00Z' },
  { id: 2, title: 'Write report', completed: false, createdAt: '2026-04-20T11:00:00Z' },
  { id: 3, title: 'Call dentist', completed: true, createdAt: '2026-04-20T12:00:00Z' },
];

const completedTasks: Task[] = [
  { id: 4, title: 'Done task', completed: true, createdAt: '2026-04-20T09:00:00Z' },
];

describe('ExportButton', () => {
  let createObjectURLMock: jest.Mock;
  let revokeObjectURLMock: jest.Mock;
  let clickMock: jest.Mock;
  let createElementSpy: jest.SpyInstance;

  beforeEach(() => {
    createObjectURLMock = jest.fn().mockReturnValue('blob:mock-url');
    revokeObjectURLMock = jest.fn();
    clickMock = jest.fn();

    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    const originalCreateElement = document.createElement.bind(document);
    createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        (el as HTMLAnchorElement).click = clickMock;
      }
      return el;
    });
  });

  afterEach(() => {
    createElementSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('renders button with correct count of outstanding tasks', () => {
    render(<ExportButton tasks={mockTasks} />);
    const button = screen.getByRole('button', { name: /Download 2 outstanding tasks as CSV/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Download CSV (2)');
  });

  it('renders button with singular label when one outstanding task', () => {
    const singleTask: Task[] = [
      { id: 1, title: 'One task', completed: false, createdAt: '2026-04-20T10:00:00Z' },
    ];
    render(<ExportButton tasks={singleTask} />);
    expect(screen.getByRole('button')).toHaveAccessibleName('Download 1 outstanding task as CSV');
  });

  it('button is disabled when no outstanding tasks', () => {
    render(<ExportButton tasks={completedTasks} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Download CSV (0)');
  });

  it('button is enabled when at least one outstanding task exists', () => {
    render(<ExportButton tasks={mockTasks} />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('triggers CSV download when clicked', () => {
    render(<ExportButton tasks={mockTasks} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });

  it('does not trigger download when no outstanding tasks', () => {
    render(<ExportButton tasks={completedTasks} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(createObjectURLMock).not.toHaveBeenCalled();
  });

  it('only includes incomplete tasks in the CSV', () => {
    render(<ExportButton tasks={mockTasks} />);
    fireEvent.click(screen.getByRole('button'));

    const blobArg: Blob = createObjectURLMock.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);

    const csvReader = new FileReader();
    return new Promise<void>((resolve) => {
      csvReader.onload = () => {
        const csv = csvReader.result as string;
        expect(csv).toContain('id,title,createdAt');
        expect(csv).toContain('Buy groceries');
        expect(csv).toContain('Write report');
        expect(csv).not.toContain('Call dentist');
        resolve();
      };
      csvReader.readAsText(blobArg);
    });
  });

  it('escapes double-quotes in task titles per RFC 4180', () => {
    const tasksWithQuotes: Task[] = [
      { id: 5, title: 'Task with "quotes"', completed: false, createdAt: '2026-04-20T10:00:00Z' },
    ];
    render(<ExportButton tasks={tasksWithQuotes} />);
    fireEvent.click(screen.getByRole('button'));

    const blobArg: Blob = createObjectURLMock.mock.calls[0][0];
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const csv = reader.result as string;
        expect(csv).toContain('"Task with ""quotes"""');
        resolve();
      };
      reader.readAsText(blobArg);
    });
  });

  it('shows no error message initially', () => {
    render(<ExportButton tasks={mockTasks} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
