import { 
    drawLine
    , doNothing
    , commandList
    , fillRectangle
    , frameRectangle
    , fillTextCentered
    , setBrushColor
    , setPenColor
    , initializeCanvas
    , requestMouseEvents
} from "../io_generator_api/command";

import { Colors } from "../io_generator_api/color";
import { Vector, isVectorInRectangle } from "../io_generator_api/vector";
import { Rectangle } from "../io_generator_api/rectangle";

import { MouseEvents, MouseClick } from "../io_generator_api/input";

const width = 800;
const height = 600;

function drawButton({ caption, rectangle }: {
    rectangle: Rectangle;
    caption: string;
}) {
    return [
        setBrushColor(Colors.lightGray)
        , fillRectangle(rectangle)
        , setPenColor(Colors.black)
        , frameRectangle(rectangle)
        , setBrushColor(Colors.black)
        , fillTextCentered(rectangle, caption)
    ]
}

function createCommandRectangles() {
    const buttonWidth = 80;
    const buttonMargin = 10;
    const [startStop, clear, quit] = [0, 1, 2].map(index => {
        const left = buttonMargin + (index * (buttonMargin + buttonWidth));
        const right = left + buttonWidth;
        return { left, right, top: 10, bottom: 30};
    });

    return { startStopCommandRectangle: startStop, clearRectangle: clear, quitCommandRectangle: quit };       
}

/** Silly little example of a line drawing mini-application. */
export default function* lineDrawer() {
    const commandRectangles = createCommandRectangles();    
    let _isLineDrawingEnabled: boolean = false;
    let _firstPointOfLine: Vector | null = null;

    let input: MouseEvents = yield initialize();
    while (true) {
        if (input instanceof MouseClick) {
            if (isVectorInRectangle(commandRectangles.quitCommandRectangle, input.point))
                return;
            else if (isVectorInRectangle(commandRectangles.clearRectangle, input.point)) {
                _firstPointOfLine = null;
                input = yield drawBackground();
            }
            else if (isVectorInRectangle(commandRectangles.startStopCommandRectangle, input.point)) {
                _isLineDrawingEnabled = !_isLineDrawingEnabled;
                _firstPointOfLine = null;
                input = yield updateButtons();
            } else if (_isLineDrawingEnabled) {
                if (!!_firstPointOfLine) {
                    const secondPoint = input.point;
                    input = yield drawLine(_firstPointOfLine, secondPoint);
                    _firstPointOfLine = secondPoint;
                }
                else {
                    _firstPointOfLine = input.point;                
                    input = yield doNothing();
                }
            }
            else
                input = yield doNothing();
        }
        else    
            input = yield doNothing();
    }

    function initialize() {
        return commandList([
            initializeCanvas({ width, height })
            , requestMouseEvents()
            , ...createBackgroundCommands()
        ]);
    }

    function createBackgroundCommands() {
        return [
            setBrushColor(Colors.white)
            , fillRectangle({ left: 0, top: 0, right: width, bottom: height })
            , setPenColor(Colors.black)
            , frameRectangle({ left: 0, top: 0, right: width, bottom: height })
            , ...drawButton({ caption: "Quit", rectangle: commandRectangles.quitCommandRectangle })
            , ...createStartStopButton()
            , ...drawButton({ caption: "Clear", rectangle: commandRectangles.clearRectangle })
        ];
    }

    function drawBackground() {
        return commandList(createBackgroundCommands());
    }

    function createStartStopButton() {
        return drawButton({ caption: _isLineDrawingEnabled ? "Stop" : "Start", rectangle: commandRectangles.startStopCommandRectangle });
    }

    function updateButtons() {
        return commandList(createStartStopButton());
    }
}