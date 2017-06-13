"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_1 = require("./parse");
describe("json parse", function () {
    // If it is an object the json file passes the parser
    describe("json should pass", function () {
        var emptyJson = "{}";
        var oneProperty = '{"name": "stemcstudio.com"}';
        var arrayJSON = '{"licenses": [{"type": "MIT","url": "https://github.com/geometryzen/davinci-matrix/blob/master/LICENSE"}]}';
        it("empty json", function () {
            expect(typeof (parse_1.parse(emptyJson))).toBe("object");
        });
        it("oneProperty", function () {
            expect(typeof (parse_1.parse(oneProperty))).toBe("object");
        });
        it("arrayJSON", function () {
            expect(typeof (parse_1.parse(arrayJSON))).toBe("object");
        });
    });
    describe("json should fail", function () {
        var incorrectJSON = '{"asdf": sdf"}';
        var testforThrow = function (test) {
            return parse_1.parse(test);
        };
        it("incorrect json", function () {
            expect(function () {
                testforThrow(incorrectJSON);
            }).toThrow();
        });
    });
});
