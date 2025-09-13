"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInjection = void 0;
const _ = __importStar(require("lodash"));
const Assert = __importStar(require("assert"));
/**
 * @class DependencyInjection
 * Provides dependency injection for Node.js
 * - Allows dependency injection for sync/async resolvers
 * - Resolves dependencies lazily if there are not provided before resolvers
 */
class DependencyInjection {
    debug;
    dependencies;
    dependants;
    /**
     * @constructor
     * @param options - Optional configuration object
     *   - debug - Enables/Disables Debug Flag to show log statements, etc
     *   - dependencies - Initialize map of dependencies that maps dependency name -> dependency
     *   - dependants - Initialize map of dependants that maps dependency name -> list of resolver functions
     */
    constructor(options = {}) {
        const { debug, dependencies, dependants } = options;
        this.debug = debug || false;
        this.dependencies = dependencies || {};
        this.dependants = dependants || {};
    }
    /**
     * Logger instance that matches signature of console.log
     * @public
     */
    log(...args) {
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
    register(dependency_key, dependency_value) {
        this.log('register', arguments);
        Assert.ok(typeof dependency_key === 'string' && dependency_key.length > 0, 'Dependency name/key has to be passed as a non-empty string');
        Assert.ok(dependency_value != null, 'Dependency (value) is required');
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
    resolve(dependencies, resolver) {
        this.log('resolve', dependencies);
        Assert.ok(dependencies instanceof Array && dependencies.length > 0, 'Dependencies have to be a non-empty list of dependencies');
        Assert.ok(resolver instanceof Function, 'Resolver has to be a function');
        for (const dependency of dependencies) {
            this.dependants[dependency] = this.dependants[dependency] || [];
            resolver.dependencies = dependencies;
            this.log('resolver dependencies', resolver.dependencies);
            this.dependants[dependency].push(resolver);
        }
        this.inject(dependencies);
    }
    /**
     * Injects list of dependencies to its resolvers
     * @public
     * @param dependencies - List of dependency keys to be resolved
     */
    inject(dependencies) {
        this.log('inject', dependencies);
        Assert.ok(dependencies instanceof Array && dependencies.length > 0, 'Dependencies have to be a non-empty list of dependencies');
        for (const dependency of dependencies) {
            const resolvers = this.dependants[dependency] || [];
            const resolved = [];
            for (const resolver of resolvers) {
                if (resolver.is_resolved) {
                    this.log(`Resolver (${resolver.name}) already resolved`);
                    resolved.push(resolver);
                }
                else {
                    const resolver_context = {};
                    const resolver_dependencies = [];
                    for (const resolver_dependency_name of resolver.dependencies || []) {
                        const resolver_dependency = this.dependencies[resolver_dependency_name];
                        if (resolver_dependency != null) {
                            resolver_context[resolver_dependency_name] = resolver_dependency;
                            resolver_dependencies.push(resolver_dependency);
                        }
                    }
                    if (resolver_dependencies.length === (resolver.dependencies || []).length) {
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
exports.DependencyInjection = DependencyInjection;
/**
 * @module DependencyInjection
 */
exports.default = DependencyInjection;
//# sourceMappingURL=index.js.map