# Voice Input Feature

## Overview
The Task Manager now supports adding tasks through voice input, allowing users to create tasks by speaking instead of typing.

## Features
- 🎤 Voice input using Web Speech API
- ✅ Confirmation dialog before creating tasks
- 📏 200 character limit with visual indicator
- 🌍 English language support
- 📱 Works on both mobile and desktop devices

## Browser Support
Voice input is supported in the following browsers:
- **Chrome** (Desktop & Mobile) - Recommended
- **Edge** (Desktop & Mobile)
- **Safari** (Desktop & Mobile)
- **Samsung Internet**

**Note:** Firefox does not currently support the Web Speech API.

## How to Use

### Step 1: Click the Voice Input Button
Click the green "🎤 Voice Input" button located below the text input field.

### Step 2: Grant Microphone Permission
If this is your first time using voice input, your browser will ask for microphone permission. Click "Allow" to proceed.

### Step 3: Speak Your Task
After clicking the button, speak your task clearly. The button will change to "🎤 Listening..." with a red pulsing animation.

### Step 4: Review and Confirm
A confirmation dialog will appear showing:
- The transcribed text
- Character count (maximum 200 characters)
- Two buttons: "Create Task" and "Cancel"

### Step 5: Create or Cancel
- Click "Create Task" to add the task to your list
- Click "Cancel" to discard and try again

## Character Limit
Voice input messages are limited to **200 characters**. The system will:
- Display "Messages should be no longer than 200 characters" above the button
- Show the character count in the confirmation dialog
- Automatically truncate messages longer than 200 characters

## Troubleshooting

### "Voice input is not supported in your browser"
- Try using Chrome, Edge, or Safari
- Update your browser to the latest version

### "Microphone access was denied"
- Click the lock icon in your browser's address bar
- Allow microphone access for the website
- Refresh the page and try again

### "No speech detected"
- Ensure your microphone is working
- Speak clearly and at a normal volume
- Try clicking the voice button again
- Check your microphone settings in system preferences

### No response after speaking
- Wait a moment for speech recognition to complete
- Check your internet connection (Web Speech API requires internet)
- Try speaking again

## Technical Details
- Uses the Web Speech API (SpeechRecognition)
- Language: English (en-US)
- No interim results (waits for complete phrases)
- Single alternative recognition (most confident result)

## Privacy
Voice input processing is handled by your browser's built-in speech recognition service. Please refer to your browser's privacy policy for information about how voice data is processed.
