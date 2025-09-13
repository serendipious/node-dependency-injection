# Dependency Injection for Node.js

A simple and intuitive asynchronous Dependency Injection library for Node.js with full TypeScript support and comprehensive test coverage.

[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-97.95%25-brightgreen.svg)](https://github.com/serendipious/node-dependency-injection)

## Why Dependency Injection?

### Dependency Injection vs. Pub-Sub/Event Listeners

| Aspect | Dependency Injection | Pub-Sub/Event Listeners |
|--------|---------------------|-------------------------|
| **Execution Timing** | Executes when dependencies are available | Fires immediately when event is emitted |
| **Dependency Management** | Creates dependency graph, resolves in correct order | No dependency tracking, manual coordination required |
| **Error Handling** | Centralized validation and error handling | Scattered across multiple listeners |
| **Type Safety** | Full TypeScript support with compile-time checking | Limited type safety, runtime errors common |
| **Testing** | Easy to mock and test individual components | Complex setup with event mocking |
| **Coupling** | Loose coupling through interfaces | Tight coupling to event names and signatures |

### When to Use This Library

**✅ Use Dependency Injection when:**
- You need to coordinate multiple services that depend on each other
- You want to ensure services are initialized in the correct order
- You need type-safe dependency resolution
- You want to easily test and mock individual components
- You need to handle complex initialization sequences

**❌ Use Pub-Sub/Event Listeners when:**
- You need immediate, fire-and-forget notifications
- You want to decouple completely unrelated components
- You need one-to-many communication patterns
- You're building real-time systems with immediate responses

### Example: Dependency Injection vs. Event Listeners

**Event Listeners (Immediate Execution):**
```javascript
// Event listeners fire immediately, even if dependencies aren't ready
eventBus.on('userCreated', (user) => {
  // This might fail if database isn't connected yet
  database.saveUser(user);
});

eventBus.on('userCreated', (user) => {
  // This might fail if email service isn't configured
  emailService.sendWelcomeEmail(user);
});

// Fires immediately - listeners might fail
eventBus.emit('userCreated', user);
```

**Dependency Injection (Coordinated Execution):**
```javascript
// Dependencies are resolved in correct order
injector.resolve(['database', 'emailService'], (db, email) => {
  // Both services are guaranteed to be ready
  db.saveUser(user);
  email.sendWelcomeEmail(user);
});

// Register dependencies when they're actually ready
injector.register('database', databaseConnection);
injector.register('emailService', emailService);
```

## Features

- ✅ **Full TypeScript Support** - Complete type definitions and IntelliSense
- ✅ **Modern Node.js** - Requires Node.js 20+ with latest features
- ✅ **Asynchronous Resolution** - Lazy dependency resolution
- ✅ **High Test Coverage** - 97.95% overall coverage, 100% source code coverage
- ✅ **Zero Dependencies** - Only uses lodash for utility functions
- ✅ **Lightweight** - Minimal overhead and bundle size

## Requirements

- Node.js 20.0.0 or higher
- TypeScript 5.0 or higher (for development)

## Installation

```bash
npm install --save git://github.com/serendipious/node-dependency-injection
```

## Quick Start

### JavaScript

```javascript
const DependencyInjector = require('di');

const injector = new DependencyInjector();

// Register dependencies
injector.register('database', { host: 'localhost', port: 5432 });
injector.register('apiKey', 'your-api-key-here');

// Resolve dependencies
injector.resolve(['database', 'apiKey'], (db, key) => {
  console.log('Database:', db);
  console.log('API Key:', key);
  // Your application logic here
});
```

### TypeScript

```typescript
import DependencyInjector, { DependencyInjectionOptions } from 'di';

interface DatabaseConfig {
  host: string;
  port: number;
}

const injector = new DependencyInjector();

// Register dependencies with type safety
injector.register('database', { host: 'localhost', port: 5432 } as DatabaseConfig);
injector.register('apiKey', 'your-api-key-here');

// Resolve dependencies with full type support
injector.resolve(['database', 'apiKey'], (db: DatabaseConfig, key: string) => {
  console.log('Database:', db);
  console.log('API Key:', key);
});
```

## API Reference

### Constructor

```typescript
new DependencyInjector(options?: DependencyInjectionOptions)
```

**Options:**
- `debug?: boolean` - Enable debug logging (default: false)
- `dependencies?: Record<string, any>` - Pre-register dependencies
- `dependants?: Record<string, Resolver[]>` - Pre-register dependants

### Methods

#### `register(dependencyKey: string, dependencyValue: any): void`

Registers a dependency that can be resolved later.

```javascript
injector.register('service', new MyService());
injector.register('config', { timeout: 5000 });
```

#### `resolve(dependencies: string[], resolver: ResolverFunction): void`

Resolves dependencies and invokes the resolver function when all dependencies are available.

```javascript
injector.resolve(['service', 'config'], (service, config) => {
  // This function is called when both 'service' and 'config' are available
  service.initialize(config);
});
```

#### `inject(dependencies: string[]): void`

Manually triggers dependency injection for the specified dependencies.

## Advanced Usage

### Lazy Resolution

Dependencies can be registered after resolvers are defined:

```javascript
// Define resolver first
injector.resolve(['userService'], (userService) => {
  console.log('User service is ready!');
});

// Register dependency later
setTimeout(() => {
  injector.register('userService', new UserService());
}, 1000);
```

### Context Access

Access dependencies through the `this` context:

```javascript
injector.resolve(['db', 'cache'], function() {
  const database = this.db;
  const cache = this.cache;
  
  // Use dependencies
  database.query('SELECT * FROM users');
});
```

### Dependency Change Detection

Resolvers are automatically re-invoked when dependencies change:

```javascript
injector.resolve(['config'], (config) => {
  console.log('Config updated:', config);
});

injector.register('config', { version: '1.0' }); // Resolver called
injector.register('config', { version: '1.0' }); // Not called (same value)
injector.register('config', { version: '2.0' }); // Resolver called again
```

### Debug Mode

Enable debug logging to track dependency resolution:

```javascript
const injector = new DependencyInjector({ debug: true });

injector.register('test', 'value');
// Output: [DependencyInjection] register [Arguments] { '0': 'test', '1': 'value' }
// Output: [DependencyInjection] inject [ 'test' ]
```

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
git clone https://github.com/serendipious/node-dependency-injection.git
cd node-dependency-injection
npm install
```

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --reporter=html
```

### Code Quality

The project maintains high code quality standards:

- **TypeScript** with strict type checking
- **Pre-commit hooks** that run tests and coverage checks
- **97.95% test coverage** with comprehensive test suite
- **Automated quality gates** prevent commits that don't meet standards

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

BSD License - see [LICENSE](LICENSE) file for details.

## Changelog

### v0.0.1
- Initial release
- TypeScript migration from CoffeeScript
- Node.js 20+ support
- Comprehensive test suite
- Full type definitions
