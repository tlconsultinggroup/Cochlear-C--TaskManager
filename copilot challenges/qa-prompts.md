# QA Demo Prompts for Task Management Application

This document provides clear instructions and prompts for generating robust unit and integration tests. Use these prompts to guide your test creation and ensure coverage of all important scenarios.

Quick Navigation:
- Basic Commands
- Backend Unit Tests
- Frontend Component Tests
- Test Coverage Analysis
- Development Approaches
- Performance Testing
- Integration Tests
- Error Handling
- Documentation

## Basic Commands

#### Code Understanding:
```
Please explain this codebase and provide a high-level summary of its structure and purpose
```

#### Server Health Check:
```
check if both servers are running correctly
```

#### Quick Start:
```
run the app locally
```

## 1. Backend Unit Test Prompts

### API Endpoint Testing
```
Generate comprehensive unit tests for all Express API endpoints
```

```
Create unit tests for GET /tasks endpoint with different scenarios
```

```
Write unit tests for POST /tasks with validation testing
```

```
Generate tests for PATCH /tasks/:id with error handling
```

```
Create unit tests for DELETE /tasks/:id with edge cases
```

### Error Handling Tests
```
Generate tests for API error responses and status codes
```

```
Create tests for invalid request payload handling
```

```
Write tests for missing required fields validation
```

### Edge Case Testing
```
Generate edge case tests for empty arrays and null values
```

```
Create tests for concurrent API requests and race conditions
```

```
Write tests for malformed JSON and invalid data types
```

## 2. Frontend Component Integration Test Prompts (React Component)

### Component Rendering Tests
```
Generate React Testing Library tests for TaskList component
```

```
Create tests for TaskInput component with form validation
```

```
Write tests for component state changes and user interactions
```

### User Interaction Tests
```
Generate tests for button clicks and form submissions
```

```
Create tests for keyboard navigation and accessibility
```

```
Write tests for component props and event handlers
```

### State Management Tests
```
Generate tests for React component state updates
```

```
Create tests for component lifecycle and useEffect hooks
```

```
Write tests for context providers and state management
```

## 3. Test Coverage Analysis

### Coverage Reports
```
Generate test coverage report for the entire application
```

```
Analyze test coverage and identify untested code paths
```

```
Create comprehensive test suite to achieve 100% coverage
```

### Coverage Improvements
```
Generate tests for uncovered functions and branches
```

```
Create integration tests to improve overall coverage
```

```
Write tests for error paths and exception handling
```

## Development Approaches

### Test-Driven Development (TDD)
```
Help me implement TDD approach for new features
```

```
Generate failing tests first, then implement the functionality
```

```
Create test cases before writing the actual code
```

### Behavior-Driven Development (BDD)
```
Generate BDD-style tests with Given-When-Then format
```

```
Create user story-based tests for task management features
```

```
Write acceptance tests from user perspective
```

## Performance Test

### Load Testing
```
Generate performance tests for API endpoints under load
```

```
Create stress tests for concurrent user scenarios
```

```
Write memory usage tests for large datasets
```

### Frontend Performance
```
Generate performance tests for React component rendering
```

```
Create tests for component re-render optimization
```

```
Write tests for memory leaks and performance bottlenecks
```

## Integration Tests

### Full Stack Integration
```
Generate end-to-end integration tests for complete user workflows
```

```
Create tests for frontend-backend communication
```

```
Write tests for data flow from UI to API to storage
```

### API Integration
```
Generate integration tests for REST API endpoints
```

```
Create tests for API request/response validation
```

```
Write tests for API authentication and authorization
```

## Add Error Handling

### Frontend Error Handling
```
Generate tests for React error boundaries and error states
```

```
Create tests for API error handling in components
```

```
Write tests for user-friendly error messages
```

### Backend Error Handling
```
Generate tests for Express.js error middleware
```

```
Create tests for database connection errors
```

```
Write tests for validation errors and status codes
```

## Documentation

### Test Documentation
```
Generate documentation for test suites and testing strategy
```

```
Create README for running and maintaining tests
```

```
Write comments and JSDoc for test functions
```

### API Documentation
```
Generate API documentation with test examples
```

```
Create OpenAPI/Swagger documentation with test cases
```

```
Write integration examples and usage scenarios
```

## Advanced Testing Scenarios

### Mock and Stub Testing
```
Generate tests using mocks for external dependencies
```

```
Create stub implementations for testing isolation
```

```
Write tests with spy functions for behavior verification
```

### Snapshot Testing
```
Generate snapshot tests for React components
```

```
Create visual regression tests for UI components
```

```
Write tests for component output consistency
```

### Security Testing
```
Generate security tests for input validation and sanitization
```

```
Create tests for XSS and injection attack prevention
```

```
Write tests for authentication and authorization
```

## Testing Best Practices

### Code Quality
```
Generate tests following testing best practices and patterns
```

```
Create maintainable and readable test code
```

```
Write tests with proper setup and teardown
```

### Test Organization
```
Generate well-organized test suites with clear structure
```

```
Create test helpers and utilities for code reuse
```

```
Write tests with descriptive names and documentation
```

## Quick Reference Commands

### Run Tests
```
How do I run the test suite?
```

```
Show me how to run tests in watch mode
```

```
How do I run specific test files or test cases?
```

### Debug Tests
```
Help me debug failing tests
```

```
How do I debug test execution step by step?
```

```
Show me how to add debugging information to tests
```

### Test Configuration
```
Help me configure testing environment and setup
```

```
Show me how to configure test runners and frameworks
```

```
How do I set up continuous integration for testing?
```

These prompts are designed to help you create comprehensive test suites using GitHub Copilot. Customize them based on your specific testing needs and requirements.
