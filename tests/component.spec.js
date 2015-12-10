var Component = require('../src/component');

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

});