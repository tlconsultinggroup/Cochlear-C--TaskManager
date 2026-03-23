import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
    onVoiceInput: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const MAX_CHARACTERS = 200;

    useEffect(() => {
        // Check if browser supports Web Speech API
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
        }
    }, []);

    const handleStartListening = () => {
        if (!isSupported) {
            alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            const trimmedResult = speechResult.substring(0, MAX_CHARACTERS);
            setTranscript(trimmedResult);
            setShowConfirmation(true);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            if (event.error === 'no-speech') {
                alert('No speech detected. Please try again.');
            } else if (event.error === 'not-allowed') {
                alert('Microphone access was denied. Please allow microphone access to use voice input.');
            } else {
                alert(`Error occurred: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleConfirm = () => {
        if (transcript.trim()) {
            onVoiceInput(transcript);
            setTranscript('');
            setShowConfirmation(false);
        }
    };

    const handleCancel = () => {
        setTranscript('');
        setShowConfirmation(false);
    };

    return (
        <div className="voice-input">
            <div className="voice-input__info">
                Messages should be no longer than {MAX_CHARACTERS} characters
            </div>
            <button
                type="button"
                onClick={handleStartListening}
                disabled={isListening || !isSupported}
                className={`voice-input__button ${isListening ? 'listening' : ''}`}
                aria-label="Start voice input"
            >
                {isListening ? '🎤 Listening...' : '🎤 Voice Input'}
            </button>

            {showConfirmation && (
                <div className="voice-input__confirmation">
                    <div className="voice-input__confirmation-overlay" onClick={handleCancel}></div>
                    <div className="voice-input__confirmation-dialog">
                        <h3>Confirm Task</h3>
                        <p className="voice-input__transcript">
                            "{transcript}"
                        </p>
                        <p className="voice-input__character-count">
                            {transcript.length}/{MAX_CHARACTERS} characters
                        </p>
                        <div className="voice-input__confirmation-buttons">
                            <button
                                onClick={handleConfirm}
                                className="voice-input__confirm-button"
                            >
                                Create Task
                            </button>
                            <button
                                onClick={handleCancel}
                                className="voice-input__cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceInput;
