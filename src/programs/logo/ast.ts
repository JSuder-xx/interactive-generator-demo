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

    public toString() { return `Number(${this.value})`; }
}

export class ReadVariable implements IExpression {
    constructor(public readonly variableName: string) {}

    public evaluate(symbolTable: SymbolTable): number {
        const value = symbolTable.lookup(this.variableName);
        if (typeof value === "number")
            return value;
        throw new Error(`Expecting a number for variable ${this.variableName}`);
    }

    public toString() { return `ReadVariable(${this.variableName})`; }

}

export abstract class BinaryExpression implements IExpression {
    
    constructor(private readonly left: IExpression, private readonly right: IExpression) {}

    public evaluate(symbolTable: SymbolTable): number {
        return this.onEvaluate(this.left.evaluate(symbolTable), this.right.evaluate(symbolTable));
    }

    public toString() { return `${this.left} ${this.onOperationName} ${this.right})`; }

    protected abstract onEvaluate(left: number, right: number): number;

    protected abstract get onOperationName(): string;

}

export class MultiplicationExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left * right;
    }

    protected get onOperationName(): string { return "*"; }

}

export class DivisionExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left / right;
    }

    protected get onOperationName(): string { return "/"; }

}

export class AdditionExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left + right;
    }

    protected get onOperationName(): string { return "+"; }

}

export class SubtractionExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left - right;
    }

    protected get onOperationName(): string { return "-"; }

}

export class ModulusExpression extends BinaryExpression {

    protected onEvaluate(left: number, right: number): number {
        return left % right;
    }

    protected get onOperationName(): string { return "%"; }

}

export class Variable {
    constructor(public readonly variableName: string) {}
    public toString() { return `Variable(${this.variableName})`; }
}

export class SetPenColorTriple {
    constructor(public readonly red: Expression, public readonly green: Expression, public readonly blue: Expression) {}
    public toString() { return `SetPenColorTriple(${this.red}, ${this.green}, ${this.blue})`; }
}

export class SetPenColorNumber {
    constructor(public readonly colorNumber: Expression) {}
    public toString() { return `SetPenColorNumber(${this.colorNumber})`; }
}

export class Forward {
    constructor(public readonly value: Expression) {}
    public toString() { return `Forward(${this.value})`; }
}

export class Backward {
    constructor(public readonly value: Expression) {}
    public toString() { return `Backward(${this.value})`; }
}

export class Left {
    constructor(public readonly value: Expression) {}
    public toString() { return `Left(${this.value})`; }
}

export class Right {
    constructor(public readonly value: Expression) {}
    public toString() { return `Right(${this.value})`; }
}

export class Repeat {
    constructor(public readonly numberOfTimes: Expression, public readonly commands: Statement[]) {}
    public toString(): string { return `Repeat ${this.numberOfTimes} [${this.commands.join(", ")}]`; }
}

export class ProcedureDefinition {
    constructor(public readonly procedureName: string, public readonly parameters: Variable[], public readonly body: Statement[]) {}
    public toString() { return `ProcedureDefinition ${this.procedureName} (${this.parameters.join(",")}) with body ${this.body.join(",")}`; }
}

export class Call {
    constructor(public readonly procedure: ProcedureDefinition, public readonly parameterValues: Expression[]) {}
    public toString() { return `'ProcedureCall of ${this.procedure} with ${this.parameterValues.join(",")}`}
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
