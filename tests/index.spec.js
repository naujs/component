'use strict';

var Component = require('..');
var Promise = require('@naujs/util').getPromise();

class AnotherComponent extends Component {
  constructor(a, b, c) {
    super();
    this.args = [a, b, c];
  }

  someMethod() {
    return 'someMethod';
  }
}

describe('Component', () => {
  var component;

  beforeEach(() => {
    component = new Component();
  });

  describe('.mixin', () => {
    it('should add new methods to the prototype', () => {
      var newMethod = jasmine.createSpy('newMethod');

      Component.mixin({
        newMethod: newMethod
      });

      var c = new Component();
      c.newMethod(1);

      expect(newMethod).toHaveBeenCalledWith(1);
    });
  });

  describe('.getInstance', () => {
    beforeEach(() => {
      Component.clearInstances();
    });

    it('should return singleton instance', () => {
      var comp0 = Component.getInstance();
      var comp1 = Component.getInstance();
      var anotherComp0 = AnotherComponent.getInstance();
      var anotherComp1 = AnotherComponent.getInstance();

      expect(comp0).toBe(comp1);
      expect(anotherComp0).not.toBe(comp0);
      expect(anotherComp0).not.toBe(comp1);
      expect(anotherComp0).toBe(anotherComp1);
      expect(anotherComp0 instanceof AnotherComponent).toBe(true);
      expect(anotherComp1 instanceof AnotherComponent).toBe(true);
    });

    it('should pass args to the instance', () => {
      var comp = AnotherComponent.getInstance(1, 2, 3);
      expect(comp.args).toEqual([1, 2, 3]);
    });
  });

  describe('#getClass', () => {
    it('should return the class', () => {
      var comp = new Component();
      expect(comp.getClass()).toBe(Component);
    });
  });

  describe('Hooks', () => {
    var calls;

    beforeEach(() => {
      calls = [];
      AnotherComponent.clearHooks('test');
    });

    it('should run hooks with the specified arguments', () => {
      AnotherComponent.watch('test', function(str) {
        calls.push(str + '0');
      });

      AnotherComponent.watch('test', function(str) {
        calls.push(str + '1');
      });

      AnotherComponent.watch('test', function(str) {
        calls.push(str + '2');
      });

      return AnotherComponent.runHooks('test', 'test').then(() => {
        expect(calls).toEqual([
          'test0',
          'test1',
          'test2'
        ]);
      });
    });

    it('should reject when one of the hook rejects', () => {
      AnotherComponent.watch('test', function(str) {
        calls.push(str + '0');
      });

      AnotherComponent.watch('test', function(str) {
        return Promise.reject(str + '1');
      });

      AnotherComponent.watch('test', function(str) {
        calls.push(str + '2');
      });

      return AnotherComponent.runHooks('test', 'test').then(() => {
        throw 'Should not resolve';
      }, (err) => {
        expect(calls).toEqual([
          'test0'
        ]);
        expect(err).toEqual('test1');
      });
    });

  });

});
