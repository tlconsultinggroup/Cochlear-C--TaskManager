import React, { useState } from 'react';
import VoiceInput from './VoiceInput';

interface TaskInputProps {
    onAddTask: (title: string) => Promise<void>;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            await onAddTask(title);
            setTitle('');
        }
    };

    const handleVoiceInput = async (text: string) => {
        if (text.trim()) {
            await onAddTask(text);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="task-input">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="task-input__field"
                />
                <button type="submit" className="task-input__button">
                    Add Task
                </button>
            </form>
            <VoiceInput onVoiceInput={handleVoiceInput} />
        </div>
    );
};

export default TaskInput;