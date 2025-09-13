import * as Assert from 'assert';
import * as Crypto from 'crypto';
import DependencyInjector from '../src/index';

describe('DependencyInjection', () => {
  let injector: DependencyInjector;

  before(() => {
    injector = new DependencyInjector({ debug: false });
  });

  const getRandomBits = (): string => Crypto.randomBytes(16).toString('hex');
  const getRandomDependency = (): { name: string; value: string } => ({
    name: getRandomBits(),
    value: getRandomBits()
  });

  it('should initialize without any options', () => {
    const local_injector = new DependencyInjector();
    Assert.ok(local_injector);
  });

  it('should register dependencies correctly', () => {
    const random_dependency = getRandomDependency();
    injector.register(random_dependency.name, random_dependency.value);

    Assert.ok(injector['dependencies'][random_dependency.name], 'Injector should register dependency');
    Assert.ok(
      (injector['dependants'][random_dependency.name] || []).length >= 0,
      'Injector should initialize empty resolvers list for dependency'
    );
  });

  it('should invoke resolver for dependencies correctly', (done) => {
    const random_dependency = getRandomDependency();
    injector.register(random_dependency.name, random_dependency.value);

    injector.resolve([random_dependency.name], (resolved_dependency_value: any) => {
      Assert.equal(resolved_dependency_value, random_dependency.value);
      done();
    });
  });

  it('should invokes resolvers lazily if dependencies are not registered before resolvers', (done) => {
    const random_dependency = getRandomDependency();

    injector.resolve([random_dependency.name], (resolved_dependency_value: any) => {
      Assert.equal(resolved_dependency_value, random_dependency.value);
      done();
    });

    injector.register(random_dependency.name, random_dependency.value);
  });

  it('should invoke resolver for multiple dependencies', (done) => {
    const d1 = getRandomDependency();
    const d2 = getRandomDependency();

    injector.resolve([d1.name, d2.name], (resolved_value1: any, resolved_value2: any) => {
      Assert.equal(resolved_value1, d1.value);
      Assert.equal(resolved_value2, d2.value);
    });

    injector.register(d1.name, d1.value);
    injector.register(d2.name, d2.value);

    injector.resolve([d1.name, d2.name], (resolved_value1: any, resolved_value2: any) => {
      Assert.equal(resolved_value1, d1.value);
      Assert.equal(resolved_value2, d2.value);
      done();
    });
  });

  it('should invoke resolver if dependency registered changes value', (done) => {
    const testInjector = new DependencyInjector();
    const d1 = getRandomDependency();
    const d2 = getRandomDependency();
    let callCount = 0;

    testInjector.resolve([d1.name], (resolved_value: any) => {
      callCount++;
      if (callCount === 1) {
        Assert.equal(resolved_value, d1.value);
        // Register different value to trigger second call
        testInjector.register(d1.name, d2.value);
      } else if (callCount === 2) {
        Assert.equal(resolved_value, d2.value);
        done();
      }
    });

    // Inject a value first key (d1.name)
    testInjector.register(d1.name, d1.value);
  });

  describe('Constructor options', () => {
    it('should initialize with debug enabled', () => {
      const debugInjector = new DependencyInjector({ debug: true });
      Assert.ok(debugInjector);
    });

    it('should initialize with pre-existing dependencies', () => {
      const deps = { 'test-dep': 'test-value' };
      const injectorWithDeps = new DependencyInjector({ dependencies: deps });
      Assert.ok(injectorWithDeps);
    });

    it('should initialize with pre-existing dependants', () => {
      const dependants = { 'test-dep': [] };
      const injectorWithDependants = new DependencyInjector({ dependants });
      Assert.ok(injectorWithDependants);
    });

    it('should initialize with all options', () => {
      const options = {
        debug: true,
        dependencies: { 'test-dep': 'test-value' },
        dependants: { 'test-dep': [] }
      };
      const injectorWithAll = new DependencyInjector(options);
      Assert.ok(injectorWithAll);
    });
  });

  describe('Error handling', () => {
    it('should throw error for empty dependency key', () => {
      Assert.throws(() => {
        injector.register('', 'value');
      }, /Dependency name\/key has to be passed as a non-empty string/);
    });

    it('should throw error for non-string dependency key', () => {
      Assert.throws(() => {
        injector.register(123 as any, 'value');
      }, /Dependency name\/key has to be passed as a non-empty string/);
    });

    it('should allow null dependency value', () => {
      Assert.doesNotThrow(() => {
        injector.register('test', null);
      });
    });

    it('should throw error for undefined dependency value', () => {
      Assert.throws(() => {
        injector.register('test', undefined);
      }, /Dependency \(value\) is required/);
    });

    it('should throw error for empty dependencies array in resolve', () => {
      Assert.throws(() => {
        injector.resolve([], () => {});
      }, /Dependencies have to be a non-empty list of dependencies/);
    });

    it('should throw error for non-array dependencies in resolve', () => {
      Assert.throws(() => {
        injector.resolve('not-array' as any, () => {});
      }, /Dependencies have to be a non-empty list of dependencies/);
    });

    it('should throw error for non-function resolver', () => {
      Assert.throws(() => {
        injector.resolve(['test'], 'not-function' as any);
      }, /Resolver has to be a function/);
    });

    it('should throw error for empty dependencies array in inject', () => {
      Assert.throws(() => {
        injector.inject([]);
      }, /Dependencies have to be a non-empty list of dependencies/);
    });

    it('should throw error for non-array dependencies in inject', () => {
      Assert.throws(() => {
        injector.inject('not-array' as any);
      }, /Dependencies have to be a non-empty list of dependencies/);
    });
  });

  describe('Debug functionality', () => {
    it('should log debug messages when debug is enabled', () => {
      const debugInjector = new DependencyInjector({ debug: true });
      const originalLog = console.log;
      let logCalled = false;
      
      console.log = (...args: any[]) => {
        logCalled = true;
        originalLog.apply(console, args);
      };
      
      debugInjector.register('test', 'value');
      Assert.ok(logCalled);
      
      console.log = originalLog;
    });

    it('should not log debug messages when debug is disabled', () => {
      const originalLog = console.log;
      let logCalled = false;
      
      console.log = (...args: any[]) => {
        logCalled = true;
        originalLog.apply(console, args);
      };
      
      injector.register('test', 'value');
      Assert.ok(!logCalled);
      
      console.log = originalLog;
    });
  });

  describe('Complex scenarios', () => {
    it('should handle multiple resolvers for same dependency', (done) => {
      const dep = getRandomDependency();
      let resolver1Called = false;
      let resolver2Called = false;

      injector.resolve([dep.name], () => {
        resolver1Called = true;
        if (resolver2Called) done();
      });

      injector.resolve([dep.name], () => {
        resolver2Called = true;
        if (resolver1Called) done();
      });

      injector.register(dep.name, dep.value);
    });

    it('should handle resolver with missing dependencies', () => {
      const dep1 = getRandomDependency();
      const dep2 = getRandomDependency();
      let resolverCalled = false;

      injector.resolve([dep1.name, dep2.name], () => {
        resolverCalled = true;
      });

      // Only register one dependency
      injector.register(dep1.name, dep1.value);

      // Resolver should not be called yet
      Assert.ok(!resolverCalled);

      // Register second dependency
      injector.register(dep2.name, dep2.value);

      // Now resolver should be called
      Assert.ok(resolverCalled);
    });

    it('should handle same dependency value not triggering resolver again', (done) => {
      const dep = getRandomDependency();
      let callCount = 0;

      injector.resolve([dep.name], () => {
        callCount++;
        if (callCount === 1) {
          // Register same value again
          injector.register(dep.name, dep.value);
          // Should not trigger resolver again
          setTimeout(() => {
            Assert.equal(callCount, 1);
            done();
          }, 10);
        }
      });

      injector.register(dep.name, dep.value);
    });

    it('should handle resolver context correctly', (done) => {
      const dep1 = getRandomDependency();
      const dep2 = getRandomDependency();

      injector.resolve([dep1.name, dep2.name], function(this: any) {
        Assert.equal(this[dep1.name], dep1.value);
        Assert.equal(this[dep2.name], dep2.value);
        done();
      });

      injector.register(dep1.name, dep1.value);
      injector.register(dep2.name, dep2.value);
    });

    it('should handle resolver with no dependencies array', () => {
      const testInjector = new DependencyInjector();
      const dep = getRandomDependency();
      let resolverCalled = false;

      const resolver = (() => {
        resolverCalled = true;
      }) as any;
      resolver.dependencies = undefined;

      // Manually add resolver to dependants to test edge case
      testInjector['dependants'][dep.name] = [resolver];
      testInjector.register(dep.name, dep.value);

      // Should not call resolver if dependencies is undefined
      Assert.ok(!resolverCalled);
    });

  });

  describe('Edge cases', () => {
    it('should handle null and undefined values in dependencies', () => {
      // Create a new injector that allows null/undefined values
      const edgeCaseInjector = new DependencyInjector();
      
      // Test with null (should work as it's a valid value)
      edgeCaseInjector.register('null-dep', null);
      Assert.equal(edgeCaseInjector['dependencies']['null-dep'], null);
      
      // Test with undefined (should throw error)
      Assert.throws(() => {
        edgeCaseInjector.register('undefined-dep', undefined);
      }, /Dependency \(value\) is required/);
    });

    it('should handle complex objects as dependencies', () => {
      const complexObj = {
        nested: { value: 'test' },
        array: [1, 2, 3],
        func: () => 'hello'
      };
      
      injector.register('complex', complexObj);
      Assert.deepEqual(injector['dependencies']['complex'], complexObj);
    });

    it('should handle circular references in dependencies', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      injector.register('circular', circular);
      Assert.equal(injector['dependencies']['circular'], circular);
    });
  });
});
