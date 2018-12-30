import { limit, range } from "../../src/helpers/number";

describe("limit", () => {

    scenarios([
        {
            given: { start: 0, end: 10 }
            , then: [
                { whenNumber: -1, thenExpect: 0 }
                , { whenNumber: 0, thenExpect: 0 }
                , { whenNumber: 1, thenExpect: 1 }
                , { whenNumber: 5, thenExpect: 5 }
                , { whenNumber: 10, thenExpect: 10 }
                , { whenNumber: 11, thenExpect: 10 }
            ]
        }
        , {
            given: { start: -5, end: 113 }
            , then: [
                { whenNumber: -6, thenExpect: -5 }
                , { whenNumber: -5, thenExpect: -5 }
                , { whenNumber: 1, thenExpect: 1 }
                , { whenNumber: 5, thenExpect: 5 }
                , { whenNumber: 112, thenExpect: 112 }
                , { whenNumber: 113, thenExpect: 113 }
                , { whenNumber: 114, thenExpect: 113 }
            ]
        }
    ])


    type Scenario = {
        given: {
            start: number;
            end: number;
        };
        then: {
            whenNumber: number;
            thenExpect: number;
        }[];         
    }
    
    function scenarios(scenarios: Scenario[]) {
        scenarios.forEach(({given, then}) => {
            describe(`GIVEN start = ${given.start} and end = ${given.end}`, () => {
                then.forEach(expectation => {
                    it(`WHEN passed ${expectation.whenNumber} THEN returns ${expectation.thenExpect}`, () =>
                        expect(limit(expectation.whenNumber, given.start, given.end)).toBe(expectation.thenExpect)
                    );
                });
            });
        });
    }

});

describe("range", () => {

    scenarios([
        { given: { inclusiveStart: 0, exclusiveEnd: 1 }, then: [0] }
        , { given: { inclusiveStart: 0, exclusiveEnd: 2 }, then: [0, 1] }
        , { given: { inclusiveStart: 0, exclusiveEnd: 5 }, then: [0, 1, 2, 3, 4] }
        , { given: { inclusiveStart: -2, exclusiveEnd: 5 }, then: [-2, -1, 0, 1, 2, 3, 4] }
    ]);

    type Scenario = {
        given: { inclusiveStart: number; exclusiveEnd: number };
        then: number[];
    }

    function scenarios(scenarios: Scenario[]) {
        scenarios.forEach(scenario => {
            it(`GIVEN ${JSON.stringify(scenario.given)} THEN ${scenario.then}`, () => 
                expect(range(scenario.given.inclusiveStart, scenario.given.exclusiveEnd)).toEqual(scenario.then)            
            );
        });        
    }

});