import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import VoiceInput from '../VoiceInput';

// Mock the Web Speech API
const mockSpeechRecognition = {
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    lang: '',
    interimResults: false,
    maxAlternatives: 1,
    onstart: null as any,
    onend: null as any,
    onresult: null as any,
    onerror: null as any,
};

const setupSpeechRecognitionMock = () => {
    (window as any).SpeechRecognition = jest.fn(() => mockSpeechRecognition);
    (window as any).webkitSpeechRecognition = jest.fn(() => mockSpeechRecognition);
};

describe('VoiceInput Component', () => {
    const mockOnVoiceInput = jest.fn();

    beforeEach(() => {
        mockOnVoiceInput.mockClear();
        jest.clearAllMocks();
        setupSpeechRecognitionMock();
    });

    it('renders voice input button and info text', () => {
        render(<VoiceInput onVoiceInput={mockOnVoiceInput} />);
        
        expect(screen.getByText(/Messages should be no longer than 200 characters/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /voice input/i })).toBeInTheDocument();
    });

    it('starts listening when button is clicked', () => {
        render(<VoiceInput onVoiceInput={mockOnVoiceInput} />);
        
        const button = screen.getByRole('button', { name: /voice input/i });
        fireEvent.click(button);
        
        expect(mockSpeechRecognition.start).toHaveBeenCalled();
    });

    it('shows confirmation dialog with transcript after speech recognition', async () => {
        render(<VoiceInput onVoiceInput={mockOnVoiceInput} />);
        
        const button = screen.getByRole('button', { name: /voice input/i });
        fireEvent.click(button);

        // Simulate speech recognition result
        const mockEvent = {
            results: [
                [{ transcript: 'Test task from voice' }]
            ]
        };
        await act(async () => {
            mockSpeechRecognition.onresult(mockEvent);
        });

        await waitFor(() => {
            expect(screen.getByText('Confirm Task')).toBeInTheDocument();
            expect(screen.getByText('"Test task from voice"')).toBeInTheDocument();
        });
    });

    it('creates task when confirmed', async () => {
        render(<VoiceInput onVoiceInput={mockOnVoiceInput} />);
        
        const button = screen.getByRole('button', { name: /voice input/i });
        fireEvent.click(button);

        // Simulate speech recognition result
        const mockEvent = {
            results: [
                [{ transcript: 'Test task from voice' }]
            ]
        };
        await act(async () => {
            mockSpeechRecognition.onresult(mockEvent);
        });

        await waitFor(() => {
            expect(screen.getByText('Create Task')).toBeInTheDocument();
        });

        const confirmButton = screen.getByText('Create Task');
        fireEvent.click(confirmButton);

        expect(mockOnVoiceInput).toHaveBeenCalledWith('Test task from voice');
    });

    it('cancels task creation when cancel is clicked', async () => {
        render(<VoiceInput onVoiceInput={mockOnVoiceInput} />);
        
        const button = screen.getByRole('button', { name: /voice input/i });
        fireEvent.click(button);

        // Simulate speech recognition result
        const mockEvent = {
            results: [
                [{ transcript: 'Test task from voice' }]
            ]
        };
        await act(async () => {
            mockSpeechRecognition.onresult(mockEvent);
        });

        await waitFor(() => {
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(mockOnVoiceInput).not.toHaveBeenCalled();
        expect(screen.queryByText('Confirm Task')).not.toBeInTheDocument();
    });

    it('truncates transcript to 200 characters', async () => {
        render(<VoiceInput onVoiceInput={mockOnVoiceInput} />);
        
        const button = screen.getByRole('button', { name: /voice input/i });
        fireEvent.click(button);

        // Create a string longer than 200 characters
        const longText = 'a'.repeat(250);
        const mockEvent = {
            results: [
                [{ transcript: longText }]
            ]
        };
        await act(async () => {
            mockSpeechRecognition.onresult(mockEvent);
        });

        await waitFor(() => {
            expect(screen.getByText('Confirm Task')).toBeInTheDocument();
        });

        const confirmButton = screen.getByText('Create Task');
        fireEvent.click(confirmButton);

        // Should only call with 200 characters
        expect(mockOnVoiceInput).toHaveBeenCalledWith('a'.repeat(200));
    });

    it('displays character count in confirmation dialog', async () => {
        render(<VoiceInput onVoiceInput={mockOnVoiceInput} />);
        
        const button = screen.getByRole('button', { name: /voice input/i });
        fireEvent.click(button);

        const mockEvent = {
            results: [
                [{ transcript: 'Test task' }]
            ]
        };
        await act(async () => {
            mockSpeechRecognition.onresult(mockEvent);
        });

        await waitFor(() => {
            expect(screen.getByText(/9\/200 characters/i)).toBeInTheDocument();
        });
    });
});
