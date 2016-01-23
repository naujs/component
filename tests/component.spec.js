'use strict';

var Component = require('../build/component');

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

});
