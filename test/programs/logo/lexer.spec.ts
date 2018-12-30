import { Tokens, tokenize } from "../../../src/programs/logo/lexer";

class Failure {}
const failure = new Failure();

describe("tokenize", () => {

    scenarios([
        { given: "forward", then: [new Tokens.Identifier("forward")] }
        , { given: "forward 10", then: [new Tokens.Identifier("forward"), new Tokens.LiteralNumber(10)] }
        , { 
            given: "repeat 4[forward 13]", 
            then: [
                new Tokens.Identifier("repeat")
                , new Tokens.LiteralNumber(4)
                , new Tokens.LeftSquareBracket()
                , new Tokens.Identifier("forward")
                , new Tokens.LiteralNumber(13)
                , new Tokens.RightSquareBracket()
            ] 
        }
    ]);

    
    type Scenario = {
        given: string;
        then: Failure | Tokens.Token[]
    };

    function scenarios(scenarios: Scenario[]) {
        scenarios.forEach(({given, then}) => {
            describe(`GIVEN '${given}'`, () => {
                if (then instanceof Failure) 
                    it("THEN expect an error when tokenizing", () => 
                        expect(() => tokenize(given)).toThrow
                    );                
                else {
                    let actualTokenStrings: string[];
                    beforeEach(() => actualTokenStrings = tokenize(given).map(it => it.toString()));
                    it(`THEN expect ${then.length} tokens`, () => 
                        expect(actualTokenStrings.length).toBe(then.length)
                    );            
                    
                    then.forEach((expectedToken, index) => {
                        it(`THEN token index ${index} matches`, () => {
                            const actualToken = actualTokenStrings[index];
                            expect(actualToken).toBe(expectedToken.toString());
                        });
                    });
                }
            });

        });
    }
    

});
