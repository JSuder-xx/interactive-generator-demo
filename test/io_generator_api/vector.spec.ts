import { addVector, distanceBetweenVectors, Vector } from "../../src/io_generator_api/vector";

describe("addVector", () => {
   
    (<[Vector, Vector, Vector][]>[
        [{x: 0, y: 0}, {x: 10, y: 5}, {x: 10, y: 5}]
        , [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]
        , [{x: 0, y: 10}, {x: 0, y: 0}, {x: 0, y: 10}]
        , [{x: 0, y: -5}, {x: 0, y: 6}, {x: 0, y: 1}]
    ]).forEach(([left, right, expectedResult]) => {
        describe(`GIVEN ${JSON.stringify(left)} and ${JSON.stringify(right)}`, () => {
            it(`THEN x = ${expectedResult.x}`, () => 
                expect(addVector(left, right).x).toBe(expectedResult.x)
            );    
            it(`THEN y = ${expectedResult.y}`, () => 
                expect(addVector(left, right).y).toBe(expectedResult.y)
            );    
        })
    });
    
});

describe("distanceBetweenVectors", () => {

    (<[Vector, Vector, number][]>[
        [{x: 0, y: 0}, {x: 10, y: 0}, 10]
        , [{x: 0, y: 0}, {x: 0, y: 10}, 10]
        , [{x: 0, y: 0}, {x: 10, y: 10}, 14.1]
    ]).forEach(([left, right, expectedResult]) => {
        it(`GIVEN ${JSON.stringify(left)} and ${JSON.stringify(right)} THEN ${expectedResult}`, () => {
            expect(distanceBetweenVectors(left, right)).toBeCloseTo(expectedResult, 1)
        })
    });

    
});

