# Workshop Setup Instructions

## Prerequisites

### GitHub Account
- Ensure you have an active GitHub account
- Verify access to GitHub Enterprise (if applicable to your organization)

### IDE Setup & Requirements

#### Supported IDEs
- **Visual Studio Code** (Recommended)
- **Visual Studio** 
- **JetBrains IDEs** (IntelliJ IDEA, WebStorm, etc.)
- **Neovim** (with appropriate plugins)

#### Required Extensions

**For Visual Studio Code:**
- GitHub Copilot
- GitHub Copilot Chat
- TypeScript and JavaScript Language Features (built-in)
- ES7+ React/Redux/React-Native snippets (optional)

**For other IDEs:**
- Install the respective GitHub Copilot plugin/extension from your IDE's marketplace

### GitHub Enterprise Enablement
1. Contact your organization's admin to enable GitHub Copilot access
2. Verify your GitHub Copilot seat assignment:
   - Go to GitHub.com → Settings → Copilot
   - Confirm your seat is active and assigned
3. Verify your license assignment in GitHub settings
4. Ensure you can access GitHub Copilot features in your IDE

## Getting Started
1. Clone this repository
2. Install dependencies: `npm install` (in both frontend and backend directories)
3. Verify GitHub Copilot is working by testing autocompletion:
   - Create a new `.js` or `.ts` file
   - Type: `// Function to calculate the sum of two numbers`
   - Press Enter and start typing: `function calculateSum(`
   - You should see Copilot suggestions appear automatically
   - If suggestions appear, Copilot is working correctly!
4. You're ready to begin the workshop!

## Need Help?
- Check IDE extension marketplace for latest Copilot versions
- Verify GitHub Enterprise permissions with your admin
- Ensure internet connectivity for Copilot suggestions
