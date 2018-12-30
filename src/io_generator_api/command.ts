import { Color } from "./color";
import { Vector } from "./vector";
import { Rectangle } from "./rectangle";

export class RequestMouseEvents { private readonly __kind: "RequestMouseEvents" = "RequestMouseEvents"; }
export const requestMouseEvents = () => new RequestMouseEvents();

export class RequestKeyboardEvents { private readonly __kind: "RequestKeyboardEvents" = "RequestKeyboardEvents"; }
export const requestKeyboardEvents = () => new RequestKeyboardEvents();

export class InitializeCanvas { 
    private readonly __kind: "InitializeCanvas" = "InitializeCanvas"; 
    constructor(private readonly args: Readonly<{ width: number; height: number }>) {}
    public get width() { return this.args.width; }
    public get height() { return this.args.height; }
}
export const initializeCanvas = (args: {width: number; height: number}) => new InitializeCanvas(args);

export class SetPenColor {
    private readonly __kind : "SetPenColor" = "SetPenColor";
    constructor(public readonly color: Color) {}    
}
export const setPenColor = (color: Color) => new SetPenColor(color);

export class SetBrushColor {
    private readonly __kind: "SetBrushColor" = "SetBrushColor";
    constructor(public readonly color: Color) {}
}
export const setBrushColor = (color: Color) => new SetBrushColor(color);

export class FillRectangle {
    private readonly __kind: "FillRectangle" = "FillRectangle";
    constructor(public readonly rectangle: Rectangle) {}
}
export const fillRectangle = (rectangle: Rectangle) => new FillRectangle(rectangle);

export class FrameRectangle {
    private readonly __kind: "FrameRectangle" = "FrameRectangle";
    constructor(public readonly rectangle: Rectangle) {}
}
export const frameRectangle = (rectangle: Rectangle) => new FrameRectangle(rectangle);

export class DrawLine {    
    constructor(public readonly first: Vector, public readonly second: Vector) {}
}
export const drawLine = (first: Vector, second: Vector) => new DrawLine(first, second);

export class FillTextCentered {
    constructor(public readonly rectangle: Rectangle, public readonly text: string) {}
}
export const fillTextCentered = (rectangle: Rectangle, text: string) => new FillTextCentered(rectangle, text);

export class DoNothing {
    private readonly __kind: "WaitForCommand" = "WaitForCommand";
}
export const doNothing = () => new DoNothing();

export class WaitMSForMouseCoords {
    private readonly __kind: "WaitMSForMouseCoords" = "WaitMSForMouseCoords";
    constructor(public readonly ms: number) {}
}
export const waitMSForMouseCoords = (ms: number) => new WaitMSForMouseCoords(ms);

export class Capture {
    constructor(public readonly captureName: string) {}
}
export const capture = (captureName: string) => new Capture(captureName);

export class RestoreCapture {
    constructor(public readonly captureName: string) {}
}
export const restoreCapture = (captureName: string) => new RestoreCapture(captureName);

export class ProvideInstructions {
    constructor(public readonly instructions: string[]) {}
}
export const provideInstructions = (instructions: string[]) => new ProvideInstructions(instructions);


export class CommmandList {
    constructor(public readonly commands: SingleCommand[]) {}
}
export const commandList = (commands: SingleCommand[]) => new CommmandList(commands);

/** A command that can be sent out from the generator to the host environment. */
export type SingleCommand =
    InitializeCanvas
    | RequestMouseEvents
    | RequestKeyboardEvents    
    | SetPenColor
    | SetBrushColor
    | FillRectangle
    | FrameRectangle
    | DrawLine
    | FillTextCentered
    | DoNothing
    | WaitMSForMouseCoords
    | Capture 
    | RestoreCapture
    | ProvideInstructions
    ;

export type Command = 
    | SingleCommand
    | CommmandList
    ;