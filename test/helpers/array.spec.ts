import { flatMap, isUniqueInPresortedArray } from "../../src/helpers/array";

describe("flatMap", () => {

    describe("given a producer which returns [val * 10, val * 20, val * 30]", () => {
        const producer = (val: number) => [val * 10, val * 20, val * 30];

        scenario({
            given: [],
            then: []
        });
        
        scenario({
            given: [1],
            then: [10, 20, 30]
        });

        scenario({
            given: [5, 3, 1],
            then: [
                50, 100, 150
                , 30, 60, 90
                , 10, 20, 30
            ]
        });

        function scenario({ given, then }: { given: number[], then: number[] }) {
            it(`"GIVEN ${given} THEN ${then}`, () =>
                expect(flatMap(given, producer)).toEqual(then)
            );
        }

    });
});

describe("isUniqueInPresortedArray", () => {

    scenario({
        given: [],
        then: true
    });

    scenario({
        given: [1],
        then: true
    });

    scenario({
        given: [1, 2, 3],
        then: true
    });

    scenario({
        given: [1, 3, 5, 7],
        then: true
    });

    function scenario({ given, then }: { given: number[]; then: boolean }) {
        it(`"GIVEN ${given} THEN ${then}`, () =>
            expect(isUniqueInPresortedArray(given)).toBe(then)
        );
    }

});
