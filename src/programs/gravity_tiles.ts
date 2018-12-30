import { 
    SingleCommand
    , commandList
    , fillRectangle
    , setBrushColor
    , initializeCanvas
    , requestMouseEvents
    , waitMSForMouseCoords
    , provideInstructions
} from "../io_generator_api/command";

import { flatMap, randomFrom } from "../helpers/array";
import { limit, range } from "../helpers/number";

import { Color, Colors, brightnesses } from "../io_generator_api/color";
import { Vector, distanceBetweenVectors, diffVector, normalize, multVector, originVector, addVector } from "../io_generator_api/vector";
import { Rectangle } from "../io_generator_api/rectangle";

import { MouseEvents, MouseClick, MousePosition } from "../io_generator_api/input";

const tileWidth = 20;
const tileHeight = 20;
const numberOfHorizontalTiles = 40;
const numberOfVerticalTiles = 30;
const width = tileWidth * numberOfHorizontalTiles;
const height = tileHeight * numberOfVerticalTiles;

const mass = 20;

class Tile {
    
    private _velocity: Vector = { x: 0, y: 0 };    
    
    constructor(private _position: Vector, private _color: Color) {}

    public get position() { return this._position; }

    public updatePosition(boundingRectangle: Rectangle, gravityWell: Vector | null): void {
        const { _position } = this;

        // update velocity
        if (gravityWell !== null) {
            const direction = diffVector(gravityWell, _position);
            const distance = limit(distanceBetweenVectors(originVector, direction), 5, 200);            
            const force = mass / (distance * distance); 
            this._velocity = addVector(this._velocity, multVector(normalize(direction), force));           
        }

        // update position        
        const { _velocity } = this;
        _position.x += _velocity.x;
        if (_position.x > boundingRectangle.right) {
            _position.x = boundingRectangle.right;
            _velocity.x *= -1;
        }
        if (_position.x < boundingRectangle.left) {
            _position.x = boundingRectangle.left;
            _velocity.x *= -1;
        }

        _position.y += _velocity.y;
        if (_position.y > boundingRectangle.bottom) {
            _position.y = boundingRectangle.bottom;
            _velocity.y *= -1;
        }
        if (_position.y < boundingRectangle.top) {
            _position.y = boundingRectangle.top;
            _velocity.y *= -1;
        }
    }

    public render(): SingleCommand[] {
        const { _position, _color } = this;
        return [
            setBrushColor(_color)
            , fillRectangle({
                left: _position.x,
                top: _position.y,
                right: _position.x + tileWidth,
                bottom: _position.y + tileHeight
            })
        ];
    }
}

const randomBrightness = randomFrom(brightnesses);

export default function* gravityTiles() {
    let _gravityPoint: Vector | null = null;
    const boundingRectangle = { left: 0, top: 0, right: width, bottom: height };
    const tiles: Tile[] = flatMap(range(0, numberOfHorizontalTiles), horizontalTileIndex =>
        flatMap(range(0, numberOfVerticalTiles), verticalTileIndex =>
            [new Tile(
                { x: horizontalTileIndex * tileWidth, y: verticalTileIndex * tileHeight }
                , { red: randomBrightness(), green: randomBrightness(), blue: randomBrightness() }
            )]
        )
    );
    let input: MouseEvents = yield commandList([
        provideInstructions([
            "Move the mouse cursor inside the window... the tiles will be attracted to the mouse position"
            , "Simply Click to Quit"
        ])
        , initializeCanvas({ width, height })
        , requestMouseEvents()
        , ...renderFrame()
    ]);

    while (true) {
        if (input instanceof MouseClick) 
            return;
        else if (input instanceof MousePosition) {            
            _gravityPoint = input.point;
            input = yield commandList(renderFrame());
        }       
        tiles.forEach(tile => tile.updatePosition(boundingRectangle, _gravityPoint));
    }

    function renderFrame() {     
        return [
            setBrushColor(Colors.white)
            , fillRectangle(boundingRectangle)
            , waitMSForMouseCoords(25)
            , ...flatMap(tiles, tile => tile.render())
        ];
    }
}