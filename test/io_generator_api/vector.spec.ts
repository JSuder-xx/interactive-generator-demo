import { addVector, distanceBetweenVectors, Vector, multVector, diffVector, normalize, vectorPolarOffset } from "../../src/io_generator_api/vector";

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

describe("diffVector", () => {
   
    (<[Vector, Vector, Vector][]>[
        [{x: 0, y: 0}, {x: 10, y: 5}, {x: -10, y: -5}]
        , [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]
        , [{x: 0, y: 10}, {x: 0, y: 0}, {x: 0, y: 10}]
        , [{x: 0, y: -5}, {x: 0, y: 6}, {x: 0, y: -11}]
    ]).forEach(([left, right, expectedResult]) => {
        describe(`GIVEN ${JSON.stringify(left)} and ${JSON.stringify(right)}`, () => {
            it(`THEN x = ${expectedResult.x}`, () => 
                expect(diffVector(left, right).x).toBe(expectedResult.x)
            );    
            it(`THEN y = ${expectedResult.y}`, () => 
                expect(diffVector(left, right).y).toBe(expectedResult.y)
            );    
        })
    });
    
});

describe("multVector", () => {

    (<[Vector, number, Vector][]>[
        [{x: 0, y: 0}, 10, {x: 0, y: 0}]
        , [{x: 1, y: 1}, 10, {x: 10, y: 10}]
        , [{x: 5, y: 0}, 8, {x: 40, y: 0}]
        , [{x: 5, y: 7}, 7, {x: 35, y: 49}]
    ]).forEach(([original, scalar, expectedResult]) => {
        describe(`GIVEN ${JSON.stringify(original)} x ${JSON.stringify(scalar)}`, () => {
            it(`THEN x = ${expectedResult.x}`, () => 
                expect(multVector(original, scalar).x).toBe(expectedResult.x)
            );    
            it(`THEN y = ${expectedResult.y}`, () => 
                expect(multVector(original, scalar).y).toBe(expectedResult.y)
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

describe("normalize", () => {

    (<[Vector, Vector][]>[
        [{x: 1, y: 1}, {x: 0.7, y: 0.7}]
        , [{x: 5, y: 0}, {x: 1, y: 0}]
        , [{x: 0, y: 5}, {x: 0, y: 1}]
        , [{x: 6, y: 8}, {x: 0.6, y: 0.8}] 
    ]).forEach(([original, expectedResult]) => {
        describe(`GIVEN ${JSON.stringify(original)}`, () => {
            it(`THEN x = ${expectedResult.x}`, () => 
                expect(normalize(original).x).toBeCloseTo(expectedResult.x, 1)
            );    
            it(`THEN y = ${expectedResult.y}`, () => 
                expect(normalize(original).y).toBeCloseTo(expectedResult.y, 1)
            );    
        })
    });
    
});

describe("vectorPolarOffset", () => {

    const scenarios: Scenario[] = [
        // property test - no matter the degrees, when radius = 0 then identity
        ...[0, 45, 90, 135, 180].map(degrees => 
            ({
                given: {
                    vector: { x: 10, y: 5 },
                    degrees,
                    radius: 0
                },
                then: { x: 10, y: 5 }
            })
        )
        , {
            given: {
                vector: { x: 10, y: 0 },
                degrees: 90,
                radius: 10
            },
            then: { x: 20, y: 0 }
        }
        , {
            given: {
                vector: { x: 10, y: 0 },
                degrees: 180,
                radius: 10
            },
            then: { x: 10, y: -10 }
        }
    ];
    scenarios.forEach(({ given, then }) => {
        describe(`GIVEN ${JSON.stringify(given)}`, () => {
            it(`THEN x = ${then.x}`, () => 
                expect(vectorPolarOffset(given).x).toBeCloseTo(then.x, 1)
            );    
            it(`THEN y = ${then.y}`, () => 
                expect(vectorPolarOffset(given).y).toBeCloseTo(then.y, 1)
            );                
        });
    });

    type Scenario = {
        given: {
            vector: Vector;
            degrees: number;
            radius: number;
        };
        then: Vector;
    }

});

