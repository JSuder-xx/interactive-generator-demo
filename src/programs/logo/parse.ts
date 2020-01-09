import SymbolTable from "./symbol_table";
import { Tokens, repcount } from "./lexer";
import { 
    AdditionExpression
    , AstNode
    , Backward
    , Call
    , DivisionExpression
    , Expression
    , Forward
    , Left
    , ModulusExpression
    , MultiplicationExpression
    , NumberLiteral
    , PenUp
    , PenDown    
    , ProcedureDefinition
    , ReadVariable
    , Repeat
    , Right
    , SetPenColorNumber
    , SetPenColorTriple
    , Statement
    , SubtractionExpression
    , Variable,
    
} from "./ast";

const forward = "forward";
const backward = "backward";
const left = "left";
const right = "right";
const repeat = "repeat";
const penUp = "penup";
const penDown = "pendown";
const setPenColor = "setpencolor";
const to = "to";
const end = "end";

export default function parse(symbolTable: SymbolTable, tokens: Tokens.Token[]): Statement[] {
    const statements: Statement[] = [];
    while (tokens.length > 0) {
        if ((currentToken() instanceof Tokens.Identifier) && ((currentToken() as Tokens.Identifier).identifierName === to)) {
            const definition = parseProcedureDefinition();
            symbolTable.declare(definition.procedureName, definition);
        }
        else
            statements.push(parseStatement());
    }
    return statements;

    function currentToken(): Tokens.Token {
        return tokens[0] || Tokens.endOfInput;
    }

    function advanceToNextToken() { tokens.shift(); }

    function expectIdentifierAndAdvance(id?: string) {
        const current = currentToken();
        if (current instanceof Tokens.Identifier) {
            if ((id !== undefined) && (current.identifierName !== id))
                throw createParseError(`Expecting identifier ${id} but found ${current.identifierName}`);
        }
        else
            throw createParseError(`Expecting identifier ${id} but did not find an identifier`);
        advanceToNextToken();
        return current.identifierName;
    }

    function createParseError(str: string): Error {
        return new Error(str);
    }

    function parseStatement(): Statement {
        const current = currentToken();
        if (current instanceof Tokens.Identifier) {
            switch (current.identifierName) {
                case forward: return parseSingleInputCommand(forward, Forward);
                case backward: return parseSingleInputCommand(backward, Backward);
                case left: return parseSingleInputCommand(left, Left);
                case right: return parseSingleInputCommand(right, Right);
                case penUp: return parseZeroInputCommand(penUp, PenUp);
                case penDown: return parseZeroInputCommand(penDown, PenDown);
                case setPenColor: return parseSetPenColor();
                case repeat: return parseRepeat();
                default: 
                    return parseCall();
            }
        }
        else 
            throw createParseError(`Error parsing statement. Expected identifier but encountered ${current}`);            
    }

    function parseExpression(): Expression {
        return parseAddSubExpression();
    }

    function parseAddSubExpression(): Expression {
        const leftExpression = parseMultDivExpression();
        
        const current = currentToken();
        if (current instanceof Tokens.Addition) {
            advanceToNextToken();
            return new AdditionExpression(leftExpression, parseMultDivExpression());
        } 
        else if (current instanceof Tokens.Subtraction) {
            advanceToNextToken();
            return new SubtractionExpression(leftExpression, parseMultDivExpression());
        }
        else
            return leftExpression;
    }

    function parseMultDivExpression(): Expression {
        const leftExpression = parsePrimary();
        
        const current = currentToken();
        if (current instanceof Tokens.Multiplication) {
            advanceToNextToken();
            return new MultiplicationExpression(leftExpression, parsePrimary());
        } 
        else if (current instanceof Tokens.Division) {
            advanceToNextToken();
            return new DivisionExpression(leftExpression, parsePrimary());
        }
        else if (current instanceof Tokens.Modulus) {
            advanceToNextToken();
            return new ModulusExpression(leftExpression, parsePrimary());
        }
        else
            return leftExpression;
    }

    function parsePrimary(): Expression {
        const current = currentToken();
        if (current instanceof Tokens.LiteralNumber) {
            advanceToNextToken();
            return new NumberLiteral(current.value);
        }
        else if (current instanceof Tokens.Variable) {
            const symbolEntry = symbolTable.lookup(current.variableName);
            if (symbolEntry instanceof Variable) {
                advanceToNextToken();
                return new ReadVariable(current.variableName);
            }
            else 
                throw createParseError(`Unable to find variable ${current.variableName} in symbol table.`);
        }
        else if (current instanceof Tokens.LeftParenthesis) {
            advanceToNextToken();
            try {
                return parseExpression();
            }
            finally {
                expectEnumTokenAndAdvance(Tokens.RightParenthesis);
            }
        }
        else
            throw createParseError(`Expecting expression but found ${current + ''}`);
    }

    function parseSingleInputCommand(identifier: string, Constructor: {new(exp: Expression): AstNode}) {
        expectIdentifierAndAdvance(identifier);
        return new Constructor(parseExpression());
    }

    function parseZeroInputCommand(identifier: string, Constructor: {new(): AstNode}) {
        expectIdentifierAndAdvance(identifier);
        return new Constructor();
    }

    function expectEnumTokenAndAdvance<T extends Tokens.Token>(TokenClass: {new(): T}) {
        const current = currentToken();
        if (current instanceof TokenClass)
            advanceToNextToken();
        else
            throw createParseError(`Expecting a right bracket but found ${current}`);
    }

    function parseSetPenColor() {
        expectIdentifierAndAdvance(setPenColor);
        const current = currentToken();
        if (current instanceof Tokens.LeftSquareBracket) {
            advanceToNextToken();
            const red = parseExpression();
            const green = parseExpression();
            const blue = parseExpression();           
            expectEnumTokenAndAdvance(Tokens.RightSquareBracket);
            return new SetPenColorTriple(red, green, blue);
        } 
        else 
            return new SetPenColorNumber(parseExpression());
    }

    function parseRepeat() {
        expectIdentifierAndAdvance(repeat);
        const repeatCount = parseExpression();
        expectEnumTokenAndAdvance(Tokens.LeftSquareBracket);
        
        const statements: Statement[] = [];
        symbolTable.pushFrame();
        try {
            symbolTable.declare(repcount, new Variable(repcount));    
            
            while (!(currentToken() instanceof Tokens.RightSquareBracket)) {
                statements.push(parseStatement());
            }
            expectEnumTokenAndAdvance(Tokens.RightSquareBracket);
        }
        finally {
            symbolTable.popFrame();
        }
        
        return new Repeat(repeatCount, statements);
    }

    function parseProcedureDefinition(): ProcedureDefinition {
        expectIdentifierAndAdvance(to);
        const procedureName = expectIdentifierAndAdvance();
        
        const parameters: Variable[] = [];
        while (currentToken() instanceof Tokens.Variable) {
            const token = currentToken() as Tokens.Variable;
            advanceToNextToken();
            parameters.push(new Variable(token.variableName));
        }

        const body: Statement[] = [];
        symbolTable.pushFrame();
        try {
            parameters.forEach(parameter => {
                symbolTable.declare(parameter.variableName, parameter);
            });

            while ((currentToken() instanceof Tokens.Identifier) && ((currentToken() as Tokens.Identifier).identifierName !== end))
                body.push(parseStatement());
            advanceToNextToken();
        }
        finally {
            symbolTable.popFrame();
        }

        return new ProcedureDefinition(procedureName, parameters, body);        
    }

    function parseCall(): Call {
        const current = currentToken();
        if (current instanceof Tokens.Identifier) {
            const symbolValue = symbolTable.lookup(current.identifierName);
            if (symbolValue instanceof ProcedureDefinition) {
                advanceToNextToken();
                const parameterValues: Expression[] = [];
                symbolValue.parameters.forEach(parameter => {
                    try {
                        parameterValues.push(parseExpression());
                    }
                    catch (ex) {
                        throw createParseError(
                            `For parameter '${parameter.variableName}' error at call site`
                            + (
                                (ex instanceof Error)
                                ? `: ${ex.message}`
                                : ``
                            )
                        );
                    }
                })
                return new Call(symbolValue, parameterValues);
            }
            else            
                throw createParseError(`Expecting the name of a defined procedure ${current.toString()}`);
        }
        else
            throw createParseError(`Expecting a call but found ${current}`);        
    }
}
