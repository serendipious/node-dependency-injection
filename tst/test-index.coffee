Assert = require 'assert'
Crypto = require 'crypto'
DependencyInjector = require '../dist'

describe 'DependencyInjection', ->
  injector = undefined

  before =>
    injector = new DependencyInjector debug: false

  getRandomBits = -> Crypto.randomBytes(16).toString('hex')
  getRandomDependency = -> name: getRandomBits(), value: getRandomBits()

  it 'should initialize without any options', =>
    local_injector = new DependencyInjector()
    Assert.ok(local_injector)

  it 'should register dependencies correctly', =>
    random_dependency = getRandomDependency()
    injector.register(random_dependency.name, random_dependency.value)

    Assert.ok injector.dependencies[random_dependency.name], 'Injector should register dependency'
    Assert.ok injector.dependants[random_dependency.name].length >= 0, 'Injector should initialize empty resolvers list for dependency'

  it 'should invoke resolver for dependencies correctly', (done) =>
    random_dependency = getRandomDependency()
    injector.register random_dependency.name, random_dependency.value

    injector.resolve [ random_dependency.name ], (resolved_dependency_value) ->
      Assert.equal resolved_dependency_value, random_dependency.value
      Assert.equal resolved_dependency_value, @[random_dependency.name]
      done()

  it 'should invokes resolvers lazily if dependencies are not registered before resolvers', (done) =>
    random_dependency = getRandomDependency()

    injector.resolve [ random_dependency.name ], (resolved_dependency_value) ->
      Assert.equal resolved_dependency_value, random_dependency.value
      Assert.equal resolved_dependency_value, @[random_dependency.name]
      done()

    injector.register random_dependency.name, random_dependency.value

  it 'should invoke resolver for multiple dependencies', (done) =>
    d1 = getRandomDependency()
    d2 = getRandomDependency()

    injector.resolve [ d1.name, d2.name ], (resolved_value1, resolved_value2) ->
      Assert.equal resolved_value1, d1.value
      Assert.equal resolved_value2, d2.value
      Assert.equal resolved_value1, @[d1.name]
      Assert.equal resolved_value2, @[d2.name]

    injector.register(d1.name, d1.value)
    injector.register(d2.name, d2.value)

    injector.resolve [ d1.name, d2.name ], (resolved_value1, resolved_value2) ->
      Assert.equal resolved_value1, d1.value
      Assert.equal resolved_value2, d2.value
      Assert.equal resolved_value1, @[d1.name]
      Assert.equal resolved_value2, @[d2.name]
      done()

  it 'should invoke resolver if dependency registered changes value', (done) =>
    d1 = getRandomDependency()
    d2 = getRandomDependency()

    injector.resolve [ d1.name ], (resolved_value) ->
      if resolved_value is d2.value
        done()

    # Inject a value first key (d1.name)
    injector.register(d1.name, d1.value)

    # Inject different value with same key (d1.name)
    injector.register(d1.name, d2.value)

