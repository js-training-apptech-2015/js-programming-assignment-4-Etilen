QUnit.test( "Task 1", function( assert ) {
    var o = new ObjectWithMethodOverloading();
    function get() {
        return this._value;
    }
    function set(x) {
        this._value = x;
    }
    o.overload('value', get);
    o.overload('value', set);
    o.value(123);
    var value = o.value();
    assert.equal(o.value(), 123);
    var o = new ObjectWithMethodOverloading();
    function multSq(n) {
        return n * n;
    }
    o.overload('mult', multSq);

    function multNumbers(n1, n2) {
        return n1 * n2;
    }
    o.overload('mult', multNumbers, [Number, Number]);

    function multStringAndNumber(s, n) {
        return Array(n).fill(s).join(''); // forgive me, IE
    }
    o.overload('mult', multStringAndNumber, [String, Number]);
    assert.equal(o.mult(3), 9);
    assert.equal(o.mult(2, 3), 6);
    assert.equal(o.mult('ab', 3), 'ababab')
});

QUnit.test( "Task 2", function( assert ) {
    define(['dep.file.js'], function(add) {
        console.log(add(2, 3));
    });
    assert.expect(0);
});