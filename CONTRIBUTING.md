# Contributing to Dependency Injection for Node.js

Thank you for your interest in contributing to this project! This guide will help you get started and ensure your contributions are high quality.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project follows a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- **Node.js 20.0.0 or higher** - [Download here](https://nodejs.org/)
- **npm 9.0.0 or higher** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **TypeScript 5.0+** - Will be installed as a dev dependency

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/node-dependency-injection.git
   cd node-dependency-injection
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/serendipious/node-dependency-injection.git
   ```

## Development Setup

### Install Dependencies

```bash
npm install
```

### Verify Setup

Run the test suite to ensure everything is working:

```bash
npm test
```

You should see all tests passing with 97.95% coverage.

### Pre-commit Hooks

The project uses Husky to run pre-commit hooks that automatically:
- Run the full test suite
- Check test coverage meets requirements (≥95%)
- Prevent commits that don't pass quality checks

These hooks are automatically installed when you run `npm install`.

**Note**: If you need to bypass pre-commit hooks (not recommended), you can use:
```bash
git commit --no-verify -m "your commit message"
```

However, this should only be used in exceptional circumstances, as it bypasses important quality checks.

## Project Structure

```
├── src/                    # Source TypeScript files
│   └── index.ts           # Main library implementation
├── tst/                   # Test files
│   └── test-index.ts      # Comprehensive test suite
├── dist/                  # Compiled JavaScript (generated)
├── coverage/              # Test coverage reports (generated)
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # Project documentation
└── CONTRIBUTING.md        # This file
```

## Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Write clean, readable TypeScript code
- Follow existing code style and patterns
- Add comprehensive tests for new functionality
- Update documentation as needed

### 3. Code Style Guidelines

#### TypeScript Best Practices

- Use strict type checking (already configured)
- Prefer `interface` over `type` for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Avoid `any` type unless absolutely necessary

#### Example:

```typescript
/**
 * Registers a new dependency in the injector
 * @param key - Unique identifier for the dependency
 * @param value - The dependency value to register
 */
register(key: string, value: any): void {
  // Implementation
}
```

#### Code Organization

- Keep functions small and focused
- Use descriptive names
- Group related functionality
- Follow the existing file structure

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with detailed coverage
npm test -- --reporter=html
```

### Test Coverage Requirements

- **Minimum 95% overall coverage**
- **100% coverage for new source code**
- **All public APIs must be tested**
- **Edge cases and error conditions must be covered**

### Writing Tests

#### Test Structure

```typescript
describe('FeatureName', () => {
  let injector: DependencyInjector;

  beforeEach(() => {
    injector = new DependencyInjector();
  });

  it('should handle normal case', () => {
    // Test implementation
  });

  it('should handle edge case', () => {
    // Test implementation
  });

  it('should throw error for invalid input', () => {
    Assert.throws(() => {
      // Invalid operation
    }, /Expected error message/);
  });
});
```

#### Test Categories

1. **Happy Path Tests** - Normal functionality
2. **Edge Case Tests** - Boundary conditions
3. **Error Handling Tests** - Invalid inputs and error conditions
4. **Integration Tests** - Complex scenarios with multiple dependencies

#### Test Naming

- Use descriptive test names that explain what is being tested
- Follow the pattern: "should [expected behavior] when [condition]"
- Examples:
  - `should register dependency correctly`
  - `should throw error for empty dependency key`
  - `should resolve multiple dependencies in correct order`

### Coverage Verification

Before submitting a PR, ensure:

```bash
npm test
```

Shows coverage of at least 95% overall and 100% for any new source code.

## Code Quality

### TypeScript Configuration

The project uses strict TypeScript settings:

- `strict: true`
- `noImplicitAny: true`
- `noImplicitReturns: true`
- `exactOptionalPropertyTypes: true`

### Linting and Formatting

- Code should be properly formatted
- Use meaningful variable names
- Add comments for complex logic
- Follow TypeScript best practices

### Performance Considerations

- Keep the library lightweight
- Avoid unnecessary dependencies
- Use efficient algorithms
- Consider memory usage

## Pull Request Process

### Before Submitting

1. **Pre-commit Hooks**: The pre-commit hook will automatically run tests and coverage checks when you commit. If tests fail, the commit will be blocked.

2. **Manual Testing** (if needed): You can also run tests manually:
   ```bash
   npm test
   ```

3. **Check Coverage**: Verify test coverage meets requirements
   ```bash
   npm run test:coverage
   ```

4. **Build Successfully**: Ensure the project builds without errors
   ```bash
   npm run build
   ```

5. **Update Documentation**: Update README.md if you've added new features

### PR Checklist

- [ ] All tests pass
- [ ] Test coverage is maintained (≥95%)
- [ ] New code has 100% test coverage
- [ ] Code follows TypeScript best practices
- [ ] Documentation is updated if needed
- [ ] PR description explains the changes
- [ ] PR is linked to any related issues

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Coverage maintained

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Review Process

1. **Automated Checks**: CI will run tests and coverage checks
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any feedback promptly
4. **Merge**: Once approved, your PR will be merged

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

1. **Environment**: Node.js version, OS
2. **Steps to Reproduce**: Clear, minimal steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Code Example**: Minimal code that reproduces the issue

### Feature Requests

For feature requests, please include:

1. **Use Case**: Why is this feature needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other approaches considered
4. **Additional Context**: Any other relevant information

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## Development Workflow

### Daily Development

1. Pull latest changes: `git pull upstream master`
2. Create feature branch: `git checkout -b feature/name`
3. Make changes and test: `npm test`
4. Commit changes: `git commit -m "feat: add new feature"`
   - Pre-commit hooks will automatically run tests and coverage checks
   - If tests fail, fix the issues before committing
5. Push to fork: `git push origin feature/name`
6. Create pull request

### Commit Message Format

Use conventional commits:

```
type(scope): description

feat: add new dependency resolution method
fix: resolve memory leak in dependency cleanup
docs: update API documentation
test: add tests for edge cases
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Code Review**: Ask questions in PR comments

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to this project! 🎉
