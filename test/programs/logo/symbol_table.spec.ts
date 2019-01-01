import SymbolTable from "../../../src/programs/logo/symbol_table";
import { Variable, ProcedureDefinition, Statement, Forward, NumberLiteral, ReadVariable, DivisionExpression, Call } from "../../../src/programs/logo/ast";

describe("SymbolTable", () => {

    describe("GIVEN an empty symbol table", () => {
        let symbolTable: SymbolTable;
        beforeEach(() => symbolTable = new SymbolTable());

        it(`THEN looking up 'x' returns null`, () => 
            expect(symbolTable.lookup("x")).toBe(null)
        );

        it(`THEN popping the frame throws an error because the symbol table requires at least one frame`, () =>
            expect(() => symbolTable.popFrame()).toThrow()
        );

        describe("WHEN adding Variable(x)", () => {
            beforeEach(() => symbolTable.declare("x", new Variable("x")));

            it(`THEN looking up 'x' returns Variable(x)`, () => 
                expect(symbolTable.lookup("x") + "").toBe(new Variable("x").toString())
            );

            it(`THEN looking up 'y' returns null`, () => 
                expect(symbolTable.lookup("y")).toBe(null)
            );

            describe("WHEN pushing a frame", () => {
                beforeEach(() => symbolTable.pushFrame());
                afterEach(() => symbolTable.popFrame());

                it(`THEN looking up 'x' returns Variable(x)`, () => 
                    expect(symbolTable.lookup("x") + "").toBe(new Variable("x").toString())
                );

                describe("WHEN adding procedure definition for x", () => {
                    beforeEach(() => symbolTable.declare("x", new ProcedureDefinition("x", [], [])));

                    it(`THEN looking up 'x' returns ProcedureDefinition(x)`, () => 
                        expect(symbolTable.lookup("x") + "").toBe(new ProcedureDefinition("x", [], []).toString())
                    );

                    describe("WHEN popping the frame", () => {
                        beforeEach(() => 
                            // testing the after effects of popping a frame after pushing a frame
                            symbolTable.popFrame()
                        );
                        afterEach(() => 
                            // NOTE: in this after we have to restore the state of the symbol table because an enclosing describe's afterEach expects the frame
                            symbolTable.pushFrame()
                        );

                        it(`THEN looking up 'x' returns Variabe(x)`, () => 
                            expect(symbolTable.lookup("x") + "").toBe(new Variable("x").toString())
                        );
                    })
                });
            });
        });
    });
})
