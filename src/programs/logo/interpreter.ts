import { flatMap } from "../../helpers/array";
import { callWithNever } from "../../helpers/union";

import SymbolTable from "./symbol_table";
import Turtle from "./turtle";
import { 
    Statement 
    , PenUp
    , PenDown
    , SetPenColorTriple
    , SetPenColorNumber
    , Forward
    , Backward
    , Left
    , Right
    , Repeat
    , Call
    , Expression
} from "./ast";

import { 
    SingleCommand
} from "../../io_generator_api/command";


export default function interpreter(symbolTable: SymbolTable, turtle: Turtle) {
    return interpret;

    function interpret(statement: Statement): SingleCommand[] {
        if (statement instanceof PenUp) 
            turtle.penUp();
        else if (statement instanceof PenDown)
            turtle.penDown();
        else if (statement instanceof SetPenColorTriple)
            return [
                turtle.setPenColorTriple({
                    red: evaluate(statement.red),
                    green: evaluate(statement.green),
                    blue: evaluate(statement.blue)
                })
            ];
        else if (statement instanceof SetPenColorNumber)
            return [turtle.setPenColorNumber(evaluate(statement.colorNumber))];
        else if (statement instanceof Forward)
            return turtle.forward(evaluate(statement.value));
        else if (statement instanceof Backward)
            return turtle.backward(evaluate(statement.value));
        else if (statement instanceof Left)
            turtle.left(evaluate(statement.value));
        else if (statement instanceof Right)
            turtle.right(evaluate(statement.value));
        else if (statement instanceof Repeat) {
            const numberOfReps = evaluate(statement.numberOfTimes);
            symbolTable.pushFrame();
            const commands: SingleCommand[] = [];
            for(let index = 0; index < numberOfReps; index++) {
                symbolTable.declare("repcount", index);
                commands.push.apply(commands, flatMap(statement.commands, interpret));
            }
            symbolTable.popFrame();

            return commands;
        }
        else if (statement instanceof Call) {
            const { parameterValues, procedure } = statement;
            if (parameterValues.length !== procedure.parameters.length)
                throw new Error(`Apparently there was an error parsing because there are ${parameterValues.length} values provided to a procedure that takes ${procedure.parameters.length}`);
            
            symbolTable.pushFrame();
            try {
                for(let idx = 0; idx < parameterValues.length; idx++) {
                    const parameterValue = parameterValues[idx];
                    const parameterVariable = procedure.parameters[idx];
                    symbolTable.declare(parameterVariable.variableName, evaluate(parameterValue));
                }

                return flatMap(procedure.body, interpret);
            }
            finally {
                symbolTable.popFrame();
            }
        }
        else
            callWithNever(statement);

        return [];
    };

    function evaluate(expression: Expression): number {
        return expression.evaluate(symbolTable);
    }
}
       