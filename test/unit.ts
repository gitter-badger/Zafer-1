/*
import assert = require('assert');

describe("Test Suite 1", () => {
    it("Test A", () => {
        assert.ok(true, "This shouldn't fail");
    });

    it("Test B", () => {
        assert.ok(1 === 1, "This shouldn't fail");
        assert.ok(false, "This should fail ts");
    });
});
*/

/*
import * as assert from "assert";
import collections = require("./Collections");

"use strict";

var Element = new collections.Generic.KeyValuePair<number>("cengiz", 3);
var Dictionary = new collections.Generic.Dictionary<number>();

export function AddTest() {
    assert.ok(Dictionary.Count() === 0);
    Dictionary.Add(Element.Key, Element.Value);
    assert.ok(Dictionary.ContainsKey(Element.Key), "Target element still exist in dictionary!");
}

export function DuplicateKeyTest() {
    if (Dictionary.Count() === 0) {
        Dictionary.Add(Element.Key, Element.Value);
    }
    assert.ok(Dictionary.Count() > 0, "There is no record in dictionary!");
    assert.ok(Dictionary.ContainsKey(Element.Key), "Target element does not exist in dictionary!");
    const preRemoveCount = Dictionary.Count();
    Dictionary.Add(Element.Key, Element.Value);
    assert.ok(Dictionary.Count() === preRemoveCount, "Duplicated entry occured!");
}

export function RemoveTest() {
    if (Dictionary.Count() === 0) {
        Dictionary.Add(Element.Key, Element.Value);
    }
    assert.ok(Dictionary.Count() > 0, "There is no record in dictionary!");
    assert.ok(Dictionary.ContainsKey(Element.Key), "Target element does not exist in dictionary!");
    Dictionary.Remove(Element.Key);
    assert.ok(Dictionary.ContainsKey(Element.Key) === false, "Target element still exist in dictionary!");
}
*/