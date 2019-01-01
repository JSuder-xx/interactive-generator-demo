import { 
    Command
    , FillTextCentered
    , DrawLine
    , FillRectangle
    , SetBrushColor
    , SetPenColor,
    InitializeCanvas,
    RequestKeyboardEvents,
    RequestMouseEvents,
    CommmandList,
    DoNothing,
    FrameRectangle,
    WaitMSForMouseCoords,
    Capture,
    RestoreCapture,
    ProvideInstructions    
} from "./command";

import { mouseClick, textInput, mousePosition } from "./input";
import { colorToString } from "./color";
import { Vector } from "./vector";
import { callWithNever } from "../helpers/union";

const fontHeightInPixels = 12;

/**
 * Executes a program returning a promise which is resolved when the program completes and rejected on an error.
 */
export default function execute({rootElement, program}: {
    /** The HTML element that will host the program I/O elements (text input, canvas, etc..) */
    rootElement: HTMLElement;
    /** 
     * An iterator that yields commands to the host and should expect input based upon what it has requested.
     * * A program must yield a command to initialize the canvas prior to 
     *   * requesting mouse events
     *   * yielding any commands to draw on the canvas.
     * * A program may yield a single command to request Keyboard events.
     **/
    program: IterableIterator<Command>
}): Promise<void> {           
    return new Promise((resolve, reject) => {
        let _instructionsContainerDiv: HTMLDivElement | null = null;
        let _textInput: HTMLInputElement | null = null;
        let _canvas: HTMLCanvasElement | null = null;
        let _canvasContext: CanvasRenderingContext2D | null = null;
        let _mousePosition: Vector | null = null;
        let _imageCaptures: { [capture: string]: ImageData } = {};
    
        // get the party started with the first request for a command from the program
        processResult(program.next());
        return;
       
        function processResult(iteratorResult: IteratorResult<Command>) {
            if (!!iteratorResult.value) 
                executeCommand(iteratorResult.value);            
            if (iteratorResult.done)
                done();            
        }

        function done() {
            if (_textInput instanceof HTMLInputElement) {
                _textInput.remove();
                _textInput.onkeydown = null;
                _textInput = null;
            }
            if (_canvas instanceof HTMLCanvasElement) {
                _canvas.remove();
                _canvas.onclick = null;
                _canvas = null;
            }

            if (_instructionsContainerDiv instanceof HTMLDivElement) {
                _instructionsContainerDiv.remove();
                _instructionsContainerDiv = null;                
            }
            resolve();
        }

        function initializeCanvas({width, height}: {width: number; height: number}): void {
            if (_canvas) {
                reject(new Error("Canvas already initialized"));
                return;
            }
            _canvas = document.createElement("canvas");
            _canvas.width = width;
            _canvas.height = height;
            const _context = _canvas.getContext("2d");
            if (!!_context)
                _canvasContext = _context;
            else 
                throw new Error("Unable to create a 2D context");            
            canvasOperation(canvas => {
                canvas.font = `${fontHeightInPixels}pt Arial`;
                canvas.textAlign = "center";      
                canvas.textBaseline = "middle";         
            });
            rootElement.appendChild(_canvas);                
        }

        function setInstructions(instructions: string[]) {
            if (!(_instructionsContainerDiv instanceof HTMLDivElement)) {
                _instructionsContainerDiv = document.createElement("div");
                rootElement.appendChild(_instructionsContainerDiv);
            }

            if (_instructionsContainerDiv instanceof HTMLDivElement) {
                _instructionsContainerDiv.innerHTML = "";
                const container = _instructionsContainerDiv;
                instructions.forEach(instruction => {
                    const paragraph = document.createElement("p");
                    paragraph.innerText = instruction;
                    container.appendChild(paragraph);
                });
            }
        }
    
        function requestMouseEvents() {
            if (_canvas instanceof HTMLCanvasElement) {
                _canvas.onclick = (ev: MouseEvent) => {
                    const { target } = ev;
                    if (target instanceof HTMLElement) {
                        const clientRectangle = target.getBoundingClientRect();                        
                        processResult(program.next(mouseClick({ x: ev.clientX - clientRectangle.left, y: ev.clientY - clientRectangle.top })));
                    }
                    else
                        reject(new Error("Expecting mouse click target to be an element."));
                };
                _canvas.onmousemove = (ev: MouseEvent) => {
                    const { target } = ev;
                    if (target instanceof HTMLElement) {
                        const clientRectangle = target.getBoundingClientRect();                        
                        _mousePosition = { x: ev.clientX - clientRectangle.left, y: ev.clientY - clientRectangle.top };
                    }
                    else
                        reject(new Error("Expecting mouse move target to be an element."));                    
                }
            }
            else
                reject(new Error("Must initialize canvas before requesting mouse events"));                
        }    

        function requestTextInput() {
            if (!!_textInput) {
                reject(new Error("Program requested text input twice."));
                return;
            }
            const textInputElement = document.createElement("input");
            textInputElement.style.width = "600px";
            textInputElement.style.display = "block";
            rootElement.appendChild(textInputElement);                
            _textInput = textInputElement;

            textInputElement.onkeydown = (ev: KeyboardEvent) => {
                if (ev.keyCode === 13) {
                    const text = textInputElement.value;
                    textInputElement.value = "";
                    processResult(program.next(textInput(text)));
                }
            };    
        }    

        function executeCommand(command: Command) {
            if (command instanceof InitializeCanvas)
                initializeCanvas(command);
            else if (command instanceof RequestKeyboardEvents) 
                requestTextInput();
            else if (command instanceof ProvideInstructions)
                setInstructions(command.instructions);
            else if (command instanceof RequestMouseEvents)
                requestMouseEvents();
            else if (command instanceof SetPenColor)
                canvasOperation(canvas => canvas.strokeStyle = colorToString(command.color));
            else if (command instanceof SetBrushColor)
                canvasOperation(canvas => canvas.fillStyle = colorToString(command.color));
            else if (command instanceof CommmandList) 
                command.commands.forEach(executeCommand);
            else if (command instanceof DoNothing) 
                return;                           
            else if (command instanceof DrawLine)
                canvasOperation(canvas => {
                    canvas.beginPath();
                    canvas.moveTo(command.first.x, command.first.y);
                    canvas.lineTo(command.second.x, command.second.y);
                    canvas.stroke();
                });
            else if (command instanceof FrameRectangle) 
                canvasOperation(canvas => {
                    const { left, top, right, bottom } = command.rectangle;
                    canvas.beginPath();
                    canvas.rect(left, top, right - left, bottom - top);
                    canvas.stroke();
                });
            else if (command instanceof FillTextCentered) 
                canvasOperation(canvas => {
                    const textWidth = canvas.measureText(command.text).width;
                    const { left, top, right, bottom } = command.rectangle;
                    const width = right - left;
                    const height = bottom - top;
                    canvas.fillText(command.text, left + (width / 2), top + (height / 2), width);
                });
            else if (command instanceof FillRectangle)
                canvasOperation(canvas => {
                    const { left, top, right, bottom } = command.rectangle;
                    canvas.fillRect(left, top, right - left, bottom - top);                
                });
            else if (command instanceof WaitMSForMouseCoords) {
                if (!_canvas)
                    reject(new Error("Waiting for mouse coordinates but canvas never initialized"));
                else 
                    waitForMouse(command.ms);
            }
            else if (command instanceof Capture)
                canvasOperation(canvas => { 
                    const canvasElement = _canvas as HTMLCanvasElement;                   
                    
                    _imageCaptures[command.captureName] = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                });
            else if (command instanceof RestoreCapture)
                canvasOperation(canvas => {
                    canvas.putImageData(_imageCaptures[command.captureName], 0, 0);
                });
            else 
                callWithNever(command);            
        }    

        function waitForMouse(waitMS: number) {
            setTimeout(
                () => {
                    if (_mousePosition !== null)
                        processResult(program.next(mousePosition(_mousePosition)));
                    else 
                        waitForMouse(waitMS);
                },
                waitMS
            );                 
        }

        function canvasOperation(fn: (canvas: CanvasRenderingContext2D) => void) {
            if (_canvasContext !== null)
                fn(_canvasContext);
            else
                reject(new Error("Attempting canvas operation but canvas has not been initialized"));
        }
    });    
}
 