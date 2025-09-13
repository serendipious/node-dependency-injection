import * as _ from 'lodash';
import * as Assert from 'assert';

/**
 * Resolver function type for dependency injection
 */
export type ResolverFunction = (...args: any[]) => void;

/**
 * Resolver with additional properties for tracking state
 */
export interface Resolver extends ResolverFunction {
  dependencies?: string[];
  is_resolved?: boolean;
  name?: string;
}

/**
 * Options for DependencyInjection constructor
 */
export interface DependencyInjectionOptions {
  debug?: boolean;
  dependencies?: Record<string, any>;
  dependants?: Record<string, Resolver[]>;
}

/**
 * @class DependencyInjection
 * Provides dependency injection for Node.js
 * - Allows dependency injection for sync/async resolvers
 * - Resolves dependencies lazily if there are not provided before resolvers
 */
export class DependencyInjection {
  private debug: boolean;
  private dependencies: Record<string, any>;
  private dependants: Record<string, Resolver[]>;

  /**
   * @constructor
   * @param options - Optional configuration object
   *   - debug - Enables/Disables Debug Flag to show log statements, etc
   *   - dependencies - Initialize map of dependencies that maps dependency name -> dependency
   *   - dependants - Initialize map of dependants that maps dependency name -> list of resolver functions
   */
  constructor(options: DependencyInjectionOptions = {}) {
    const { debug, dependencies, dependants } = options;
    this.debug = debug || false;
    this.dependencies = dependencies || {};
    this.dependants = dependants || {};
  }

  /**
   * Logger instance that matches signature of console.log
   * @public
   */
  private log(...args: any[]): void {
    args[0] = '[DependencyInjection] ' + args[0];
    if (this.debug) {
      console.log.apply(console, args);
    }
  }

  /**
   * Registers dependency name/key -> dependency
   * @public
   * @param dependency_key - Dependency name/key
   * @param dependency_value - Dependency value
   */
  register(dependency_key: string, dependency_value: any): void {
    this.log('register', arguments);
    Assert.ok(
      typeof dependency_key === 'string' && dependency_key.length > 0,
      'Dependency name/key has to be passed as a non-empty string'
    );
    Assert.ok(dependency_value !== undefined, 'Dependency (value) is required');

    // Reset resolvers if new dependency is being injected
    const old_dependency_value = this.dependencies[dependency_key];
    const resolvers = this.dependants[dependency_key] || [];
    for (const resolver of resolvers) {
      this.log(`Checking resolver ${resolver}; Is it already resolved = ${resolver.is_resolved}`);
      if (JSON.stringify(dependency_value) !== JSON.stringify(old_dependency_value)) {
        this.log(`Resetting Resolver (${resolver.name})`);
        resolver.is_resolved = false;
      }
    }

    // Set dependencies prior to injecting them into resolvers
    this.dependencies[dependency_key] = dependency_value;
    this.inject([dependency_key]);
  }

  /**
   * Resolves a list of dependencies and invokes a resolver function with those dependencies as arguments
   * @public
   * @param dependencies - List of dependency keys to be resolved
   * @param resolver - Function to be invoked when dependencies are resolved. All dependencies are passed as arguments to the resolver function.
   */
  resolve(dependencies: string[], resolver: ResolverFunction): void {
    this.log('resolve', dependencies);
    Assert.ok(
      dependencies instanceof Array && dependencies.length > 0,
      'Dependencies have to be a non-empty list of dependencies'
    );
    Assert.ok(resolver instanceof Function, 'Resolver has to be a function');

    for (const dependency of dependencies) {
      this.dependants[dependency] = this.dependants[dependency] || [];
      (resolver as Resolver).dependencies = dependencies;
      this.log('resolver dependencies', (resolver as Resolver).dependencies);
      this.dependants[dependency].push(resolver as Resolver);
    }
    this.inject(dependencies);
  }

  /**
   * Injects list of dependencies to its resolvers
   * @public
   * @param dependencies - List of dependency keys to be resolved
   */
  inject(dependencies: string[]): void {
    this.log('inject', dependencies);
    Assert.ok(
      dependencies instanceof Array && dependencies.length > 0,
      'Dependencies have to be a non-empty list of dependencies'
    );

    for (const dependency of dependencies) {
      const resolvers = this.dependants[dependency] || [];
      const resolved: Resolver[] = [];

      for (const resolver of resolvers) {
        if (resolver.is_resolved) {
          this.log(`Resolver (${resolver.name}) already resolved`);
          resolved.push(resolver);
        } else {
          const resolver_context: Record<string, any> = {};
          const resolver_dependencies: any[] = [];
          for (const resolver_dependency_name of resolver.dependencies || []) {
            const resolver_dependency = this.dependencies[resolver_dependency_name];
            if (resolver_dependency != null) {
              resolver_context[resolver_dependency_name] = resolver_dependency;
              resolver_dependencies.push(resolver_dependency);
            }
          }

          if (resolver.dependencies && resolver_dependencies.length === resolver.dependencies.length) {
            resolved.push(resolver);
            resolver.is_resolved = true;
            resolver.apply(resolver_context, resolver_dependencies);
          }
        }
      }

      this.dependants[dependency] = _.without(resolvers, ...resolved);
    }
  }
}

/**
 * @module DependencyInjection
 */
export default DependencyInjection;
