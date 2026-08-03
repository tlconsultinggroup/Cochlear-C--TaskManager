import React from 'react';
import { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (id: number) => Promise<void>;
    onDeleteTask: (id: number) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
    const isTaskOverdue = (task: Task): boolean => {
        if (!task.dueDate || task.completed) {
            return false;
        }

        const dueDate = new Date(task.dueDate);
        const dueDateEnd = new Date(dueDate);
        dueDateEnd.setHours(23, 59, 59, 999);

        return dueDateEnd.getTime() < Date.now();
    };

    const formatDueDate = (dueDate: string): string => {
        return new Date(dueDate).toLocaleDateString();
    };

    return (
        <ul className="task-list">
            {tasks.map((task) => {
                const isOverdue = isTaskOverdue(task);

                return (
                    <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleTask(task.id)}
                            className="task-item__checkbox"
                        />
                        <div className="task-item__details">
                            <span className="task-item__title">{task.title}</span>
                            {task.dueDate && (
                                <span className="task-item__due-date">
                                    Due: {formatDueDate(task.dueDate)}
                                </span>
                            )}
                            {isOverdue && (
                                <span className="task-item__overdue-badge">Overdue</span>
                            )}
                        </div>
                        <button
                            onClick={() => onDeleteTask(task.id)}
                            className="task-item__delete"
                        >
                            Delete
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default TaskList;