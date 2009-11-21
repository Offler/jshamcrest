/**
 * Integration utilities.
 */
JsHamcrest.Integration = {

    /**
     * Copies all members of an object to another.
     */
    copyMembers: function(source, target) {
        if (!source) {
            JsHamcrest.Integration.copyMembers(JsHamcrest.Matchers, target);
            JsHamcrest.Integration.copyMembers(JsHamcrest.Operators, target);
        } else {
            for (var method in source) {
                if (!(method in target)) {
                    target[method] = source[method];
                }
            }
        }
    },

    /**
     * JsTestDriver integration.
     */
    JsTestDriver: function(params) {
        params = params ? params : {};
        var target = params.scope || window;

        this.copyMembers(null, target);

        // Function called when an assertion fails.
        function fail(message) {
            var exc = new Error(message);
            exc.name = 'AssertError';

            // Removes all jshamcrest-related entries from error stack
            var stack = exc.stack.split('\n');
            var newStack = '';
            for (var i = 0; i < stack.length; i++) {
                if (!/jshamcrest*\.js\:/i.test(stack[i])) {
                    newStack += stack[i] + '\n';
                }
            }
            exc.stack = newStack;
            throw exc;
        };

        // Assertion method exposed to JsTestDriver.
        target.assertThat = function (actual, matcher, message) {
            return JsHamcrest.Operators.assert(actual, matcher, {
                message: message,
                fail: fail
            });
        };
    },

    /**
     * JsUnitTest integration.
     */
    JsUnitTest: function(params) {
        params = params ? params : {};
        var target = params.scope || JsUnitTest.Unit.Testcase.prototype;

        this.copyMembers(null, target);

        // Assertion method exposed to JsUnitTest.
        target.assertThat = function (actual, matcher, message) {
            var self = this;

            return JsHamcrest.Operators.assert(actual, matcher, {
                message: message,
                fail: function(message) {
                    self.fail(message);
                },
                pass: function() {
                    self.pass();
                }
            });
        };
    },

    /**
     * YUITest (Yahoo UI) integration.
     */
    YUITest: function(params) {
        params = params ? params : {};
        var target = params.scope || window;

        this.copyMembers(null, target);

        target.Assert = YAHOO.util.Assert;

        // Assertion method exposed to YUITest.
        YAHOO.util.Assert.that = function(actual, matcher, message) {
            return JsHamcrest.Operators.assert(actual, matcher, {
                message: message,
                fail: function(message) {
                    YAHOO.util.Assert.fail(message);
                }
            });
        };
    },

    /**
     * QUnit (JQuery) integration.
     */
    QUnit: function(params) {
        params = params ? params : {};
        var target = params.scope || window;

        this.copyMembers(null, target);

        // Assertion method exposed to QUnit.
        target.assertThat = function(actual, matcher, message) {
            return JsHamcrest.Operators.assert(actual, matcher, {
                message: message,
                fail: function(message) {
                    QUnit.ok(false, message);
                },
                pass: function(message) {
                    QUnit.ok(true, message);
                }
            });
        };
    },

    /**
     * jsUnity integration.
     */
    jsUnity: function(params) {
        params = params ? params : {};
        var target = params.scope || jsUnity.env.defaultScope;
        var assertions = params.attachAssertions || false;

        this.copyMembers(null, target);

        if (assertions) {
            jsUnity.attachAssertions(target);
        }

        // Assertion method exposed to jsUnity.
        target.assertThat = function(actual, matcher, message) {
            return JsHamcrest.Operators.assert(actual, matcher, {
                message: message,
                fail: function(message) {
                    throw message;
                }
            });
        };
    },

    /**
     * Screw.Unit integration.
     */
    screwunit: function(params) {
        params = params ? params : {};
        var target = params.scope || Screw.Matchers;

        this.copyMembers(null, target);

        // Assertion method exposed to jsUnity.
        target.assertThat = function(actual, matcher, message) {
            return JsHamcrest.Operators.assert(actual, matcher, {
                message: message,
                fail: function(message) {
                    throw message;
                }
            });
        };
    }
};

