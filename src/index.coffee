_ = require 'underscore'
Assert = require 'assert'

##
# @class DependencyInjection
# Provides dependency injection for Node.js
# - Allows dependency injection for sync/async resolvers
# - Resolves dependencies lazily if there are not provided before resolvers
##
class DependencyInjection
  ##
  # @constructor
  # @param @optional {Object} options
  #   - @property @optional {Boolean} debug - Enables/Disables Debug Flag to show log statements, etc
  #   - @property @optional {Object<String, Any>} dependencies - Initialize map of dependencies that maps dependency name -> dependency
  #   - @property @optional {Object<String, Array<Function>} dependants - Initialize map of dependants that maps dependency name -> list of resolver functions
  ##
  constructor: (options = {}) ->
    {debug, dependencies, dependants} = options
    @debug = debug or false
    @dependencies = dependencies or {}
    @dependants = dependants or {}

  ##
  # Logger instance that matches signature of console.log
  # @public
  ##
  log: ->
    arguments[0] = '[DependencyInjection] ' + arguments[0]
    console.log.apply(console, arguments) if @debug

  ##
  # Registers dependency name/key -> dependency
  # @public
  # @param @required {String} dependency_key - Dependency name/key
  # @param @required {Any} dependency_value - Dependency value
  ##
  register: (dependency_key, dependency_value) ->
    @log 'register', arguments
    Assert.ok(typeof dependency_key is 'string' and dependency_key.length > 0, 'Dependency name/key has to be passed as a non-empty string')
    Assert.ok(dependency_value?, 'Dependency (value) is required')

    # Reset resolvers if new dependency is being injected
    old_dependency_value = @dependencies[dependency_key]
    resolvers = @dependants[dependency_key] or []
    for resolver in resolvers
      @log "Checking resolver #{resolver}; Is it already resolved = #{resolver.is_resolved}"
      if JSON.stringify(dependency_value) isnt JSON.stringify(old_dependency_value)
        @log "Resetting Resolver (#{resolver.name})" 
        resolver.is_resolved = false

    # Set dependencies prior to injecting them into resolvers
    @dependencies[dependency_key] = dependency_value
    @inject [ dependency_key ]

  ##
  # Resolves a list of dependencies and invokes a resolver function with those dependencies as arguments
  # @public
  # @param @required {Array<String>} dependencies - List of dependency keys to be resolved
  # @param @required {Function} resolver - Function to be invoked when dependencies are resolved. All dependencies are passed as arguments to the resolver function.
  ##
  resolve: (dependencies, resolver) ->
    @log 'resolve', dependencies
    Assert.ok(dependencies instanceof Array and dependencies.length > 0, 'Dependencies have to be a non-empty list of dependencies')
    Assert.ok(resolver instanceof Function, 'Resolver has to be a function');

    for dependency in dependencies
      @dependants[dependency] = @dependants[dependency] or []
      resolver.dependencies = dependencies
      @log 'resolver dependencies', resolver.dependencies
      @dependants[dependency].push(resolver)
    @inject(dependencies)

  ##
  # Injects list of dependencies to its resolvers
  # @public
  # @param @required {Array<String>} dependencies - List of dependency keys to be resolved
  ##
  inject: (dependencies) ->
    @log 'inject', dependencies
    Assert.ok(dependencies instanceof Array and dependencies.length > 0, 'Dependencies have to be a non-empty list of dependencies')

    for dependency in dependencies
      resolvers = @dependants[dependency] or []
      resolved = []

      for resolver in resolvers
        if resolver.is_resolved
          @log "Resolver (#{resolver.name}) already resolved"
          resolved.push(resolver)
        else
          resolver_context = {}
          resolver_dependencies = []
          for resolver_dependency_name in resolver.dependencies
            resolver_dependency = @dependencies[resolver_dependency_name]
            if resolver_dependency?
              resolver_context[resolver_dependency_name] = resolver_dependency
              resolver_dependencies.push(resolver_dependency)

          if resolver_dependencies.length is resolver.dependencies.length
            resolved.push(resolver)
            resolver.is_resolved = true
            resolver.apply(resolver_context, resolver_dependencies)

      @dependants[dependency] = _(resolvers).without(resolved)

##
# @module DependencyInjection
##
module.exports = DependencyInjection
