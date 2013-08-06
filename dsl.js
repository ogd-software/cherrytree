define(function (require) {

  var _ = require("underscore");

  function DSL(name) {
    this.parent = name;
    this.matches = [];
    this.stateClasses = {};
  }

  DSL.prototype = {
    resource: function(name, options, callback) {
      if (arguments.length === 2 && typeof options === 'function') {
        callback = options;
        options = {};
      }

      if (arguments.length === 1) {
        options = {};
      }

      if (typeof options.path !== 'string') {
        options.path = "/" + name;
      }

      if (callback) {
        var dsl = new DSL(name);
        callback.call(dsl);
        this.push(options.path, name, dsl.generate());
        _.extend(this.stateClasses, dsl.stateClasses);
      } else {
        this.push(options.path, name);
      }
    },

    push: function(url, name, callback) {
      var parts = name.split('.');
      if (url === "" || url === "/" || parts[parts.length-1] === "index") { this.explicitIndex = true; }

      this.matches.push([url, name, callback]);
    },

    route: function(name, options) {
      // Ember.assert("You must use `this.resource` to nest", typeof options !== 'function');

      options = options || {};

      if (typeof options.path !== 'string') {
        options.path = "/" + name;
      }

      if (this.parent && this.parent !== 'application') {
        name = this.parent + "." + name;
      }

      this.push(options.path, name);
    },

    states: function (map) {
      var prefix = "";
      if (this.parent && this.parent !== 'application') {
        prefix = this.parent;
      }

      _.each(map, function (state, name) {
        if (prefix) {
          name = prefix + "." + name;
        }
        this.stateClasses[name] = state;
      }, this);
    },

    generate: function() {
      var dslMatches = this.matches;

      if (!this.explicitIndex) {
        this.route("index", { path: "/" });
      }

      return function(match) {
        for (var i=0, l=dslMatches.length; i<l; i++) {
          var dslMatch = dslMatches[i];
          match(dslMatch[0]).to(dslMatch[1], dslMatch[2]);
        }
      };
    }
  };

  DSL.map = function(callback) {
    var dsl = new DSL();
    callback.call(dsl);
    return dsl;
  };

  return DSL;

});