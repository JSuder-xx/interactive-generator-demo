import { 
    Command
    , commandList
    , fillRectangle
    , fillTextCentered
    , setBrushColor
    , initializeCanvas
    , requestMouseEvents
    , provideInstructions
} from "../io_generator_api/command";
import { Colors } from "../io_generator_api/color";

import * as Iterator from "../helpers/iterator";
import { isUniqueInPresortedArray } from "../helpers/array";

module Logic  {

    function* floors() {
        yield* [1, 2, 3, 4, 5];   
    }

    const adjacentFloors = (left: number, right: number): boolean =>
        Math.abs(left - right) === 1;

    export function multipleDwelling() {
        return Iterator.flatMap(
            Iterator.filter(floors(), baker => baker !== 5),
            baker => Iterator.flatMap(
                Iterator.filter(
                    floors(), 
                    cooper => 
                        cooper !== 1 
                        && cooper !== baker
                ),
                cooper => Iterator.flatMap(
                    Iterator.filter(
                        floors(), 
                        fletcher => 
                            fletcher !== 5 
                            && fletcher !== 1 
                            && fletcher !== baker 
                            && fletcher !== cooper 
                            && !adjacentFloors(fletcher, cooper)
                    ),
                    fletcher => Iterator.flatMap(
                        Iterator.filter(
                            floors(), 
                            miller => 
                                miller > cooper 
                                && miller !== baker 
                                && miller !== fletcher
                        ),
                        miller => Iterator.map(
                            Iterator.filter(floors(), smith => 
                                isUniqueInPresortedArray([baker, cooper, fletcher, miller, smith].sort((l, r) => l - r))
                                // && !adjacentFloors(smith, fletcher)
                            ),
                            smith => ({ baker, cooper, fletcher, miller, smith })
                        )
                    )
                )
            )            
        );
    }
}

export default function* ambExample() {
    const canvasRectangle = { left: 0, top: 0, right: 640, bottom: 50 };
    let initialized = false;
    for(let result of Logic.multipleDwelling()) {
        yield commandList([
            ...initialized
                ? []
                : [
                    provideInstructions([
                        "Demonstration of using generators as lazy streams to implement a version of the Amb operator as defined in 4.3.2 of Structure and Interpretation of Computer Programs (SICP)."
                        , "Just click anywhere in the solution window to get the next solution."
                    ])
                    , initializeCanvas({ width: canvasRectangle.right, height: canvasRectangle.bottom })                    
                    , requestMouseEvents()            
                ]
            , setBrushColor(Colors.white)
            , fillRectangle(canvasRectangle)
            , setBrushColor(Colors.black)
            , fillTextCentered(canvasRectangle, `Solution: ${JSON.stringify(result)}`)
        ]);
        initialized = true;
    }
}