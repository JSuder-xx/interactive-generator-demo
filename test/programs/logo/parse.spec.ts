import SymbolTable from "../../../src/programs/logo/symbol_table";
import { Variable, ProcedureDefinition, Statement, Forward, NumberLiteral, ReadVariable, DivisionExpression, Call } from "../../../src/programs/logo/ast";
import { Tokens } from "../../../src/programs/logo/lexer";
import parse from "../../../src/programs/logo/parse";

describe("parse", () => {

    scenario({
        given: {
            symbolTable: [],
            tokens: []
        },
        then: []
    });

    scenario({
        given: {
            symbolTable: [],
            tokens: [new Tokens.Identifier("forward"), new Tokens.LiteralNumber(10)]
        },
        then: [new Forward(new NumberLiteral(10))]
    });

    scenario({
        given: {
            symbolTable: [],
            tokens: [new Tokens.Identifier("forward"), new Tokens.Variable("x")]
        },
        then: new Error()
    });

    scenario({
        given: {
            symbolTable: [{name: "x", value: new Variable("x") }],
            tokens: [new Tokens.Identifier("forward"), new Tokens.Variable("x")]
        },
        then: [new Forward(new ReadVariable("x"))]
    });

    scenario({
        given: {
            symbolTable: [{name: "x", value: new Variable("x") }],
            tokens: [new Tokens.Identifier("forward"), new Tokens.Variable("x"), new Tokens.Division(), new Tokens.LiteralNumber(10)]
        },
        then: [
            new Forward(new DivisionExpression(
                new ReadVariable("x"), 
                new NumberLiteral(10)
            ))
        ]
    });

    const routineWithoutArguments = new ProcedureDefinition("routineWithoutArguments", [], []);
    const routineWithSingleArgument = new ProcedureDefinition("routineWithSingleArgument", [new Variable("Arg1")], []);

    scenario({
        given: {
            symbolTable: [{
                name: routineWithoutArguments.procedureName,
                value: routineWithoutArguments
            }],
            tokens: [new Tokens.Identifier(routineWithoutArguments.procedureName)]
        },
        then: [
            new Call(
                routineWithoutArguments,
                []
            )
        ]
    });

    scenario({
        given: {
            symbolTable: [{
                name: routineWithoutArguments.procedureName,
                value: routineWithoutArguments
            }],
            tokens: [new Tokens.Identifier(routineWithoutArguments.procedureName), new Tokens.LiteralNumber(10)]
        },
        then: new Error() // ERROR because the routine takes no arguments and was followed by a hanging numeric literal
    });

    scenario({
        given: {
            symbolTable: [{
                name: routineWithSingleArgument.procedureName,
                value: routineWithSingleArgument
            }],
            tokens: [new Tokens.Identifier(routineWithSingleArgument.procedureName)]
        },
        then: new Error() // ERROR because this routine requires an argument
    });

    scenario({
        given: {
            symbolTable: [{
                name: routineWithSingleArgument.procedureName,
                value: routineWithSingleArgument
            }],
            tokens: [new Tokens.Identifier(routineWithSingleArgument.procedureName), new Tokens.LiteralNumber(123)]
        },
        then: [
            new Call(
                routineWithSingleArgument,
                [new NumberLiteral(123)]
            )
        ]
    });

    scenario({
        given: {
            symbolTable: [],
            tokens: [
                new Tokens.Identifier("to")
                , new Tokens.Identifier("dosomethingsimple")
                , new Tokens.Variable("arg1")
                , new Tokens.Identifier("forward")
                , new Tokens.Variable("arg1")
                , new Tokens.Identifier("end")
            ]
        },
        then: []
    })

    type SymbolTableEntry = {
        name: string;
        value: Variable | ProcedureDefinition;
    }
    
    type Scenario = {
        given: {
            symbolTable: SymbolTableEntry[];
            tokens: Tokens.Token[]
        };
        then: Statement[] | Error;
    }
    
    function createSymbolTable(entries: SymbolTableEntry[]) {
        const table = new SymbolTable();
        entries.forEach(entry => {
            table.declare(entry.name, entry.value);
        });
        return table;
    }
    
    function scenario({ given, then }: Scenario) {
    
        describe(`GIVEN Symbol Table ${given.symbolTable.length === 0 ? 'Empty' : given.symbolTable.map(it => it.name).join(", ")}`, () => {
            describe(`GIVEN tokens ${given.tokens.join(", ")}`, () => {
                let actualStatements: Statement[] | Error;
                beforeAll(() => {
                    try {
                        actualStatements = parse(createSymbolTable(given.symbolTable), given.tokens);
                    }
                    catch (ex) {
                        actualStatements = (ex instanceof Error) ? ex : new Error("Unknown");
                    }
                });

                if (then instanceof Error) 
                    it(`Expecting an eror`, () => expect(actualStatements instanceof Error).toBe(true));
                else {                    
                    it(`Expecting ${then.length} statements`, () => {
                        if (actualStatements instanceof Error)
                            expect(actualStatements.message).toBe("Not be an error");
                        else 
                            expect(actualStatements.length).toBe(then.length);
                    });

                    then.forEach((expectedStatement, index) => {
                        it(`Expect statement at index ${index} to be ${expectedStatement}`, () => {
                            if (actualStatements instanceof Error) {
                            } else 
                                expect(actualStatements[index].toString()).toBe(expectedStatement.toString())                                                            
                        });
                    });              
                }                                
            });
        });
    
    }   
    
});
