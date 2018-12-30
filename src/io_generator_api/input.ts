import { Vector } from "./vector";

export class MouseClick {
    private readonly __kind: "MouseClick" = "MouseClick";
    constructor(public readonly point: Vector) {}
}
export const mouseClick = (pt: Vector) => new MouseClick(pt);

export class MousePosition {
    private readonly __kind: "MousePosition" = "MousePosition";
    constructor(public readonly point: Vector) {}
}
export const mousePosition = (pt: Vector) => new MousePosition(pt);

export class TextInput {
    constructor(public readonly text: string) {}
}
export const textInput = (text: string) => new TextInput(text);

export type MouseEvents = 
    MouseClick
    | MousePosition
    ;

export type KeyboardEvents = 
    TextInput
    ;

export type MouseAndKeyboardEvents = 
    MouseEvents
    | KeyboardEvents;