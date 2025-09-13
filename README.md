Dependency Injection for Node.js
--------------------------------
This module provides very simple and intuitive asynchronous Dependency Injection for Node.js with full TypeScript support.

## Requirements

- Node.js 20.0.0 or higher
- TypeScript 5.0 or higher (for development)

## Installation

You can install the module by using NPM as follows:

```bash
npm install --save git://github.com/serendipious/node-dependency-injection
```

## Usage

### JavaScript

For using the module, first `require` it as follows:

```javascript
const DependencyInjector = require('di');
```

To create a new injector, just instantiate a new instance:

```javascript
const injector = new DependencyInjector();
```

### TypeScript

For TypeScript projects, import the module:

```typescript
import DependencyInjector, { DependencyInjectionOptions } from 'di';

const injector = new DependencyInjector();
```

## API

The module provides two basic methods for dependency injection: `register` and `resolve`. `register` allows you to define your dependency and `resolve` allows you to resolve dependencies and use them.

You can `register` dependencies before/after you resolve them. The resolver will resolve dependencies asynchronously and invoke your listener only when the dependencies are available:

```javascript
injector.register('a', 12345);

injector.resolve(['a', 'b'], function(a, b) {
  // Use `a` and `b` here
  // This function will be invoked after `a` and `b` are injected
});

injector.register('b', { foo: 'bar' });
```

The dependencies are injected as arguments to your listener. Alternately, you can use dependencies via the `context` i.e. the `this` of the listener:

```javascript
injector.resolve(['a', 'b'], function() {
  // De-reference `a` and `b` using `this`
  const a = this.a;
  const b = this.b;

  // Use `a` and `b` here
  // This function will be invoked after `a` and `b` are injected
});
```

If a dependency is resolved once with a specific value, and then the dependency is re-injected with a different value, the resolver will be invoked again:

```javascript
injector.resolve(['a'], function resolver(a) {
  // `a` = { foo: 'bar' } the first time
  // `a` = { foo: 'foobar' } the second time
});

// The resolver above will get invoked
injector.register('a', { foo: 'bar' });

// The resolver above will not get invoked again
injector.register('a', { foo: 'bar' });

// The resolver above will get invoked again 
// since injected dependency has changed
injector.register('a', { foo: 'foobar' });
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```
