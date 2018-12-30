import { 
    setPenColor
    , drawLine
} from "../../io_generator_api/command";

import { Vector, vectorPolarOffset } from "../../io_generator_api/vector";
import { Brightness, Color, Colors, colorOrThrow, limitToBrightness } from "../../io_generator_api/color";

const colorNumbersMap: { [num: number]: Color } = {
    0: Colors.black
    , 1: Colors.blue
    , 2: Colors.green
    , 3: Colors.cyan
    , 4: Colors.red
    , 5: Colors.magenta
    , 6: Colors.yellow
    , 7: Colors.white
    , 8: colorOrThrow(155, 96, 59)
    , 9: colorOrThrow(197, 136, 18)
    , 10: colorOrThrow(100, 162, 64)
    , 11: colorOrThrow(120, 187, 187)
    , 12: colorOrThrow(255, 149, 119)
    , 13: colorOrThrow(144, 113, 208)
    , 14: colorOrThrow(255, 163, 0)
    , 15: colorOrThrow(183, 183, 183)
};

export default class Turtle {

    private _angle: number = 180;
    private _penDown: boolean = true;

    constructor(private _position: Vector) {}

    public penUp(): void { this._penDown = false; }

    public penDown(): void { this._penDown = true; }

    public setPenColorTriple({red, green, blue}: {red: number; green: number; blue: number}) {
        return setPenColor({
            red: limitToBrightness(red),
            green: limitToBrightness(green),
            blue: limitToBrightness(blue)
        });
    }

    public setPenColorNumber(colorNumber: number) {
        colorNumber = colorNumber % 16;
        return setPenColor(colorNumbersMap[colorNumber]);
    }

    public forward(pixels: number) {
        const lastPosition = this._position;
        this._position = vectorPolarOffset({
            vector: lastPosition,
            degrees: this._angle,
            radius: pixels            
        });
        
        return this._penDown
            ? [drawLine(lastPosition, this._position)]
            : [];
    }

    public backward(pixels: number) {
        return this.forward(-1 * pixels);
    }

    public left(deg: number) { this._angle += deg; }

    public right(deg: number) { this._angle -= deg; }

    public draw() {
        const { _angle, _position } = this;

        const headOfArrow = rotation(_angle);
        const base1 = rotation(_angle + 150);
        const base2 = rotation(_angle + 210);
        return [
            drawLine(headOfArrow, base1)
            , drawLine(base1, base2)
            , drawLine(base2, headOfArrow)           
        ];

        function rotation(degrees: number) {
            return vectorPolarOffset({
                vector: _position,
                degrees,
                radius: 10
            });
        }
    }

}
