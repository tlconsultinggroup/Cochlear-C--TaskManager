import React, { useEffect, useState, useCallback } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import { Task } from './types';
import './App.css';


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || '/api';
  console.log('API URL:', API_URL); // Add logging

  const fetchTasks = useCallback(async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      // Retry logic: retry up to 3 times with exponential backoff
      // This helps when backend is still initializing
      if (retryCount < 3) {
        // Exponential backoff: delays of 1s, 2s, and 4s for retries 0, 1, and 2 respectively.
        // The 5-second cap prevents delays from exceeding 5 seconds on subsequent retries.
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
        setTimeout(() => fetchTasks(retryCount + 1), delay);
      } else {
        // Only show error after all retries exhausted
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string) => {
    setError(null);
    try {
      console.log('Sending request to add task:', { title });
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      const responseData = await response.json();
      console.log('Server response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to add task');
      }
      
      setTasks(prevTasks => [...prevTasks, responseData]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add task';
      console.error('Detailed error:', error);
      setError(errorMessage);
    }
  };

  const toggleTask = async (id: number) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Failed to toggle task');
      }
      const updatedTask = await response.json();
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle task');
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
      </header>
      <main className="App-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <TaskInput onAddTask={addTask} />
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;
