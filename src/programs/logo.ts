import { flatMap } from "../helpers/array";

import { 
    commandList
    , initializeCanvas
    , Command
    , requestKeyboardEvents
    , setPenColor
    , capture
    , restoreCapture
    , provideInstructions
    , frameRectangle
    , fillRectangle
    , setBrushColor
    , fillTextCentered
} from "../io_generator_api/command";
import { TextInput } from "../io_generator_api/input";
import { Colors, colorOrThrow } from "../io_generator_api/color";
import { Rectangle } from "../io_generator_api/rectangle";

import SymbolTable from "./logo/symbol_table";
import interpreter from "./logo/interpreter";
import { tokenize } from "./logo/lexer";
import parse from "./logo/parse";
import Turtle from "./logo/turtle";


const width = 800;
const height = 600;

const instructions: string[] = [
    "A !TOY! implementation of Logo/Turtle graphics. Movement commands { Forward, Backward, Right, Left }. Pen commands { PenUp, PenDown, SetPenColor }. _NOTE_: SetPenColor takes either a single color number ('SetPenColor 3') OR three RGB arguments ('SetPenColor [255 128 128]')"
    , "Composability { Repeat, To, procedure calling }. Quit by entering 'quit'"
    , "EXAMPLE (define 'square'): to square :size repeat 4 [ forward :size right 90 ] end"
    , "EXAMPLE (define 'spiral'): to spiral :size :repetitions repeat :repetitions [ right (360 / :repetitions) square :size ] end"
    , "EXAMPLE (execute): repeat 15 [ setpencolor (1 + (:repcount % 5)) spiral (repcount * 10) (6 + (repcount * 3)) ]"
];

const backgroundBufferName = "background";

export default function* logo(): IterableIterator<Command> {
    const turtle = new Turtle({ x: width / 2, y: height / 2});
    const okStatusArea: Rectangle = { left: 4, top: 4, right: 40, bottom: 24 };
    const errorStatusArea: Rectangle = { left: 4, top: 4, right: width - 4, bottom: 24 };
    let input: TextInput = yield createEnvironmentInitialization();

    const symbolTable = new SymbolTable();
    const interpret = interpreter(symbolTable, turtle);
    while (input.text !== "quit") {        
        const { backgroundCommands, statusCommands } = generateOutput(input.text);
        input = yield commandList([
            restoreCapture(backgroundBufferName)
            , ...backgroundCommands
            , capture(backgroundBufferName)

            , ...statusCommands
            
            , ...turtle.draw()
        ]); 
    }

    return;

    function createEnvironmentInitialization() {
        return commandList([
            provideInstructions(instructions)
            , requestKeyboardEvents()
            , initializeCanvas({ width, height })
            , setPenColor(Colors.black)
            , frameRectangle({ left: 0, top: 0, right: width, bottom: height })
            , capture(backgroundBufferName)
            , ...turtle.draw()
        ]);       
    }

    function generateOutput(logoCommands: string) {
        try {
            return {
                backgroundCommands: flatMap(parse(symbolTable, tokenize(logoCommands)), interpret)
                , statusCommands: [
                    setBrushColor(Colors.black)
                    , fillRectangle(okStatusArea)
                    , setBrushColor(colorOrThrow(64, 255, 64))
                    , fillTextCentered(okStatusArea, `OK`)
                ]
            };            
        } catch (ex) {            
            return {
                backgroundCommands: []
                , statusCommands: [
                    setBrushColor(Colors.black)
                    , fillRectangle(errorStatusArea)
                    , setBrushColor(colorOrThrow(255, 64, 64))
                    , fillTextCentered(
                        errorStatusArea, 
                        `MESSAGE: ${ex instanceof Error ? ex.message : 'UNKNOWN'}`
                    )
                ]
            };
        }        
    }
}
