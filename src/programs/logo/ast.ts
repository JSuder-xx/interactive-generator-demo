import SymbolTable from "./symbol_table";

export class PenUp {}

export class PenDown {}

export interface IExpression {
    evaluate(symbolTable: SymbolTable): number;
}

export class NumberLiteral implements IExpression {
    constructor(public readonly value: number) {}
    
    public evaluate(symbolTable: SymbolTable): number {
        return this.value;
    }
}

export class ReadVariable implements IExpression {
    constructor(public readonly variableName: string) {}

    public evaluate(symbolTable: SymbolTable): number {
        const value = symbolTable.lookup(this.variableName);
        if (typeof value === "number")
            return value;
        throw new Error(`Expecting a number for variable ${this.variableName}`);
    }

}

export abstract class BinaryExpression implements IExpression {
    
    constructor(private readonly left: IExpression, private readonly right: IExpression) {}

    public evaluate(symbolTable: SymbolTable): number {
        return this.onEvaluate(this.left.evaluate(symbolTable), this.right.evaluate(symbolTable));
    }

    protected abstract onEvaluate(left: number, right: number): number;

}

export class MultiplicationExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left * right;
    }

}

export class DivisionExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left / right;
    }

}

export class AdditionExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left + right;
    }

}

export class SubtractionExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left - right;
    }

}

export class ModulusExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left % right;
    }

}

export class Variable {
    constructor(public readonly variableName: string) {}
}

export class SetPenColorTriple {
    constructor(public readonly red: Expression, public readonly green: Expression, public readonly blue: Expression) {}
}

export class SetPenColorNumber {
    constructor(public readonly colorNumber: Expression) {}
}

export class Forward {
    constructor(public readonly value: Expression) {}
}

export class Backward {
    constructor(public readonly value: Expression) {}
}

export class Left {
    constructor(public readonly value: Expression) {}
}

export class Right {
    constructor(public readonly value: Expression) {}
}

export class Repeat {
    constructor(public readonly numberOfTimes: Expression, public readonly commands: Statement[]) {}
}

export class ProcedureDefinition {
    constructor(public readonly procedureName: string, public readonly parameters: Variable[], public readonly body: Statement[]) {}
}

export class Call {
    constructor(public readonly procedure: ProcedureDefinition, public readonly parameterValues: Expression[]) {}
}

export type Expression =
    NumberLiteral
    | ReadVariable
    | AdditionExpression
    | SubtractionExpression
    | MultiplicationExpression
    | DivisionExpression
    | ModulusExpression
    ;

export type Statement =
    PenUp
    | PenDown
    | SetPenColorTriple
    | SetPenColorNumber
    | Forward
    | Backward
    | Left
    | Right
    | Repeat
    | Call
    ;

export type AstNode = 
    ProcedureDefinition
    | Statement
    ;
