Dependency Injection for Node.js
--------------------------------
This module provides very simple and intuitive asynchronous Dependency Injection for Node.js


## Usage

You can install the module by using NPM as follows:

	nom install --save git://github.com/serendipious/node-dependency-injection


For using the module, first `require` it as follows:

	var DependencyInjector = require('di');


To create a new injector, just instantiate a new instance:

	var injector = new DependencyInjector();


The module provides two basic methods for dependency injection: `inject` and `resolve`. `inject` allows you to define your dependency and `resolve` allows you to resolve dependencies and use them.

You can `inject` dependencies before/after you resolve them. The resolver will resolve dependencies asynchronously and invoke your listener only when the dependencies are available:

	injector.inject('a', 12345);

	injector.resolve(['a', 'b'], function(a, b) {
      // Use `a` and `b` here
      // This function will be invoked after `a` and `b` are injected
  	});

  	injector.inject('b', { foo: 'bar' });

The dependencies are injected as arguments to your listener. Alternately, you can use dependencies via the `context` i.e. the `this` of the listener:

	injector.resolve(['a', 'b'], function() {
      // De-reference `a` and `b` using `this`
      var a = this.a;
      var b = this.b;

   	  // Use `a` and `b` here
      // This function will be invoked after `a` and `b` are injected
  	});
