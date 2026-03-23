import React from 'react';
import { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (id: number) => Promise<void>;
    onDeleteTask: (id: number) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        className="task-item__checkbox"
                    />
                    <span className="task-item__title">{task.title}</span>
                    <button
                        onClick={() => onDeleteTask(task.id)}
                        className="task-item__delete"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;