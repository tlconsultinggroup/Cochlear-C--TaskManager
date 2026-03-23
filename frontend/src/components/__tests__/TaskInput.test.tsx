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
        expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    it('handles empty input submission', async () => {
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        const button = screen.getByText('Add Task');
        fireEvent.click(button);
        
        expect(mockOnAddTask).not.toHaveBeenCalled();
    });    it('handles valid task submission', async () => {
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        const input = screen.getByPlaceholderText('Add a new task...');
        await act(async () => {
            fireEvent.change(input, { target: { value: 'New Task' } });
        });
        
        const button = screen.getByText('Add Task');
        await act(async () => {
            fireEvent.click(button);
        });
        
        expect(mockOnAddTask).toHaveBeenCalledWith('New Task');
        await act(async () => {
            // Wait for state update
            await Promise.resolve();
        });
        expect(input).toHaveValue('');
    });
});
