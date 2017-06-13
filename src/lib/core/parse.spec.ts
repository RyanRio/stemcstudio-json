import { parse } from './parse';

describe("json parse", function() {
    // If it is an object the json file passes the parser
    describe("json should pass", function() {
        const emptyJson = "{}";
        const oneProperty = '{"name": "stemcstudio.com"}';
        const arrayJSON = '{"licenses": [{"type": "MIT","url": "https://github.com/geometryzen/davinci-matrix/blob/master/LICENSE"}]}';
        it("empty json", function() {
            expect(typeof(parse(emptyJson))).toBe("object");
        });
        it("oneProperty", function() {
            expect(typeof(parse(oneProperty))).toBe("object");
            
        });
        it("arrayJSON", function() {
            expect(typeof(parse(arrayJSON))).toBe("object");
        });
    });
    describe("json should fail", function() {
        const incorrectJSON = '{"asdf": sdf"}';
        const testforThrow = function(test: string): string | object {
            return parse(test);
        };
        it("incorrect json", function() {
            expect(function() {
                testforThrow(incorrectJSON);
            }).toThrow();
        });
    });
});
