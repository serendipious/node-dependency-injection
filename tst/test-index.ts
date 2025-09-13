import * as Assert from 'assert';
import * as Crypto from 'crypto';
import DependencyInjector from '../dist';

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
      injector['dependants'][random_dependency.name].length >= 0,
      'Injector should initialize empty resolvers list for dependency'
    );
  });

  it('should invoke resolver for dependencies correctly', (done) => {
    const random_dependency = getRandomDependency();
    injector.register(random_dependency.name, random_dependency.value);

    injector.resolve([random_dependency.name], (resolved_dependency_value: any) => {
      Assert.equal(resolved_dependency_value, random_dependency.value);
      Assert.equal(resolved_dependency_value, (this as any)[random_dependency.name]);
      done();
    });
  });

  it('should invokes resolvers lazily if dependencies are not registered before resolvers', (done) => {
    const random_dependency = getRandomDependency();

    injector.resolve([random_dependency.name], (resolved_dependency_value: any) => {
      Assert.equal(resolved_dependency_value, random_dependency.value);
      Assert.equal(resolved_dependency_value, (this as any)[random_dependency.name]);
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
      Assert.equal(resolved_value1, (this as any)[d1.name]);
      Assert.equal(resolved_value2, (this as any)[d2.name]);
    });

    injector.register(d1.name, d1.value);
    injector.register(d2.name, d2.value);

    injector.resolve([d1.name, d2.name], (resolved_value1: any, resolved_value2: any) => {
      Assert.equal(resolved_value1, d1.value);
      Assert.equal(resolved_value2, d2.value);
      Assert.equal(resolved_value1, (this as any)[d1.name]);
      Assert.equal(resolved_value2, (this as any)[d2.name]);
      done();
    });
  });

  it('should invoke resolver if dependency registered changes value', (done) => {
    const d1 = getRandomDependency();
    const d2 = getRandomDependency();

    injector.resolve([d1.name], (resolved_value: any) => {
      if (resolved_value === d2.value) {
        done();
      }
    });

    // Inject a value first key (d1.name)
    injector.register(d1.name, d1.value);

    // Inject different value with same key (d1.name)
    injector.register(d1.name, d2.value);
  });
});
