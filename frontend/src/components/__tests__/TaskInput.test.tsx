import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import TaskInput from '../TaskInput';

describe('TaskInput Component', () => {
    const mockOnAddTask = jest.fn();

    beforeEach(() => {
        mockOnAddTask.mockClear();
    });

    it('renders input field and add button', () => {
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
        expect(screen.getByLabelText('Due date')).toBeInTheDocument();
        expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    it('handles empty input submission', async () => {
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        const button = screen.getByText('Add Task');
        fireEvent.click(button);
        
        expect(mockOnAddTask).not.toHaveBeenCalled();
    });

    it('handles valid task submission', async () => {
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        const input = screen.getByPlaceholderText('Add a new task...');
        await act(async () => {
            fireEvent.change(input, { target: { value: 'New Task' } });
        });
        
        const button = screen.getByText('Add Task');
        await act(async () => {
            fireEvent.click(button);
        });
        
        expect(mockOnAddTask).toHaveBeenCalledWith('New Task', undefined);
        await act(async () => {
            // Wait for state update
            await Promise.resolve();
        });
        expect(input).toHaveValue('');
    });

    it('submits due date when provided', async () => {
        render(<TaskInput onAddTask={mockOnAddTask} />);

        const titleInput = screen.getByPlaceholderText('Add a new task...');
        const dueDateInput = screen.getByLabelText('Due date');
        const button = screen.getByText('Add Task');

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Task with due date' } });
            fireEvent.change(dueDateInput, { target: { value: '2030-01-15' } });
            fireEvent.click(button);
        });

        expect(mockOnAddTask).toHaveBeenCalledWith('Task with due date', '2030-01-15');
    });
});
