import execute from "./io_generator_api/execute";
import { Command } from "./io_generator_api/command";

import lineDrawer from "./programs/line_drawer";
import ambExample from "./programs/amb_example";
import gravityTiles from "./programs/gravity_tiles";
import logo from "./programs/logo";

main();

function main() {
    const selectionDiv = document.createElement("div");
    selectionDiv.appendChild(createProgramLink("Logo", logo));
    selectionDiv.appendChild(createProgramLink("Gravity Tiles", gravityTiles));
    selectionDiv.appendChild(createProgramLink("Line Drawer", lineDrawer));
    selectionDiv.appendChild(createProgramLink("Amb Example", ambExample));
    const programContainerDiv = document.createElement("div");

    document.body.appendChild(selectionDiv);
    document.body.appendChild(programContainerDiv);
    return;

    function createProgramLink(caption: string, programThunk: () => IterableIterator<Command>) {
        const anchor  = document.createElement("a");
        anchor.innerHTML = caption;
        anchor.onclick = () => {
            executeProgram(programThunk());
        }
        return anchor;
    }
    
    function executeProgram(program: IterableIterator<Command>) {
        selectionDiv.style.display = "none";
        execute({ 
            rootElement: programContainerDiv,
            program
        }).then(
            () => {            
                done();
            },
            (err: Error) => {
                alert(`Error: ${err.message}`);
                done();
            }
        );
    
        function done() {
            selectionDiv.style.display = "";
        }
    }    
}
