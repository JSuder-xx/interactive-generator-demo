import { flatMap } from "../../helpers/array";

export module Tokens {

    export class Identifier {
        constructor(public readonly identifierName: string) {}
        toString() { return `Identifier(${this.identifierName})`; }
    }

    export class Variable {
        constructor(public readonly variableName: string) {}
        toString() { return `Variable(${this.variableName})`; }
    }

    export class LiteralNumber {
        constructor(public readonly value: number) {}
        toString() { return `LiteralNumber(${this.value})`; }
    }

    export class LeftSquareBracket { toString() { return `[`; } }

    export class RightSquareBracket { toString() { return `]`; } }

    export class LeftParenthesis { toString() { return `(`; } }

    export class RightParenthesis { toString() { return `)`; } }

    export class Multiplication { toString() { return `*`; } }

    export class Division { toString() { return `/`; } }

    export class Addition { toString() { return `+`; } }

    export class Subtraction { toString() { return `-`; } }

    export class Modulus { toString() { return `%`; } }

    export type Token = 
        Identifier
        | Variable
        | LiteralNumber
        | LeftSquareBracket
        | RightSquareBracket
        | LeftParenthesis
        | RightParenthesis
        | Multiplication
        | Division
        | Addition
        | Subtraction
        | Modulus
        ;
}

const singleCharRegEx = /[()+-\/*\[\]]/;

export const repcount = "repcount";

export const tokenize = (str: string): Tokens.Token[] => 
    // Slow and not robust. Quick-to-code.
    flatMap(
        str.split(""),
        charStr =>
            singleCharRegEx.test(charStr)  
                ? [" ", charStr, " "]
                : [charStr]
    )
        .join("")
        .split(/\s+/g)
        .map(it => 
            (it || "").trim().toLowerCase()
        )
        .filter(it => it.length > 0)        
        .map(toToken);          

const identifierRegEx = /[a-zA-Z_][0-9a-zA-Z_]*/;

const simpleTokenClassMap: { [token: string]: {new(): Tokens.Token} } = {
    "[": Tokens.LeftSquareBracket,
    "]": Tokens.RightSquareBracket,
    "(": Tokens.LeftParenthesis,
    ")": Tokens.RightParenthesis,
    "+": Tokens.Addition,
    "-": Tokens.Subtraction,
    "*": Tokens.Multiplication,
    "/": Tokens.Division,
    "%": Tokens.Modulus
};

const toToken = (str: string): Tokens.Token => {
    const asNumber = Number(str);
    if (!isNaN(asNumber))
        return new Tokens.LiteralNumber(asNumber);

    const simpleTokenClass = simpleTokenClassMap[str];
    if (!!simpleTokenClass)
        return new simpleTokenClass();
    
    if (str[0] === ":") {
        const identifier = str.slice(1);
        if (!identifierRegEx.test(identifier))
            throw new Error(`Invalid variable ${str}`);
        return new Tokens.Variable(identifier);        
    }
    if (str === repcount)
        return new Tokens.Variable(repcount);
    if (identifierRegEx.test(str))
        return new Tokens.Identifier(str);

    throw new Error(`"Unknown token ${str}`);
};            
