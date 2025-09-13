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
export declare class DependencyInjection {
    private debug;
    private dependencies;
    private dependants;
    /**
     * @constructor
     * @param options - Optional configuration object
     *   - debug - Enables/Disables Debug Flag to show log statements, etc
     *   - dependencies - Initialize map of dependencies that maps dependency name -> dependency
     *   - dependants - Initialize map of dependants that maps dependency name -> list of resolver functions
     */
    constructor(options?: DependencyInjectionOptions);
    /**
     * Logger instance that matches signature of console.log
     * @public
     */
    private log;
    /**
     * Registers dependency name/key -> dependency
     * @public
     * @param dependency_key - Dependency name/key
     * @param dependency_value - Dependency value
     */
    register(dependency_key: string, dependency_value: any): void;
    /**
     * Resolves a list of dependencies and invokes a resolver function with those dependencies as arguments
     * @public
     * @param dependencies - List of dependency keys to be resolved
     * @param resolver - Function to be invoked when dependencies are resolved. All dependencies are passed as arguments to the resolver function.
     */
    resolve(dependencies: string[], resolver: ResolverFunction): void;
    /**
     * Injects list of dependencies to its resolvers
     * @public
     * @param dependencies - List of dependency keys to be resolved
     */
    inject(dependencies: string[]): void;
}
/**
 * @module DependencyInjection
 */
export default DependencyInjection;
//# sourceMappingURL=index.d.ts.map