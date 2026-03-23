import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskList from '../TaskList';
import { Task } from '../../types';

describe('TaskList Component', () => {
    const mockTasks: Task[] = [
        {
            id: 1,
            title: 'Test Task 1',
            completed: false,
            createdAt: new Date()
        },
        {
            id: 2,
            title: 'Test Task 2',
            completed: true,
            createdAt: new Date()
        }
    ];

    const mockOnToggleTask = jest.fn();
    const mockOnDeleteTask = jest.fn();

    beforeEach(() => {
        mockOnToggleTask.mockClear();
        mockOnDeleteTask.mockClear();
    });

    it('renders list of tasks', () => {
        render(
            <TaskList
                tasks={mockTasks}
                onToggleTask={mockOnToggleTask}
                onDeleteTask={mockOnDeleteTask}
            />
        );

        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('handles task toggle', () => {
        render(
            <TaskList
                tasks={mockTasks}
                onToggleTask={mockOnToggleTask}
                onDeleteTask={mockOnDeleteTask}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);

        expect(mockOnToggleTask).toHaveBeenCalledWith(1);
    });

    it('handles task deletion', () => {
        render(
            <TaskList
                tasks={mockTasks}
                onToggleTask={mockOnToggleTask}
                onDeleteTask={mockOnDeleteTask}
            />
        );

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(mockOnDeleteTask).toHaveBeenCalledWith(1);
    });

    it('displays completed tasks with proper styling', () => {
        render(
            <TaskList
                tasks={mockTasks}
                onToggleTask={mockOnToggleTask}
                onDeleteTask={mockOnDeleteTask}
            />
        );

        const completedTaskContainer = screen.getByText('Test Task 2').closest('li');
        expect(completedTaskContainer).toHaveClass('completed');
    });
});
