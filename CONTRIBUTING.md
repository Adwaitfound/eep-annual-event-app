# Contributing to EEP Annual Event App

First off, thank you for considering contributing to the EEP Annual Event App! It's people like you that make this application better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this standard.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots** if possible
- **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints (run `npm run lint`)
5. Format your code (run `npm run format`)
6. Write a clear commit message

## Development Process

### Setting Up Your Development Environment

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up your Firebase project and configure `.env`
4. Start the development server: `npm start`

### Coding Standards

- Follow the existing code style
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused
- Write self-documenting code when possible

### JavaScript Style Guide

- Use ES6+ features
- Use functional components and hooks for React
- Prefer `const` over `let`, avoid `var`
- Use template literals for string concatenation
- Use destructuring when appropriate
- Use async/await over promises when possible

### Component Guidelines

- Keep components small and focused on a single responsibility
- Use PropTypes or TypeScript for type checking
- Separate container and presentational components
- Keep state as local as possible
- Use Context API for global state

### Naming Conventions

- **Components**: PascalCase (e.g., `LoginScreen.js`)
- **Functions**: camelCase (e.g., `handleLogin`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Files**: Match the component name (e.g., `Button.js` for `Button` component)

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:
```
Add user authentication with Firebase
Fix session overlap detection bug
Update README with setup instructions
```

### Branch Naming

- `feature/` - New features (e.g., `feature/speaker-voting`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-context`)

## Testing

- Write unit tests for utilities and services
- Write integration tests for complex features
- Ensure all tests pass before submitting a PR
- Aim for good test coverage, but don't sacrifice clarity

## Documentation

- Update the README.md if you change functionality
- Comment your code where necessary
- Update inline documentation for functions
- Keep the CHANGELOG.md updated

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

Thank you for contributing! 🎉
