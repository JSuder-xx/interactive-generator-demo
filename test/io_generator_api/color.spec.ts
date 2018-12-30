import { Colors, Color, Brightness, brightnessToHex, colorToString } from "../../src/io_generator_api/color";

describe("brightnessToHex", () => {

    (<[Brightness, string][]>[
        [0, "00"]
        , [1, "01"]
        , [15, "0f"]
        , [16, "10"]
        , [255, "ff"]
    ]).forEach(([brightness, hexString]) => {
        it(`GIVEN ${brightness} THEN ${hexString}`, () =>
            expect(brightnessToHex(brightness)).toBe(hexString)
        );
    });   

});

describe("colorToString", () => {

    (<[Color, string][]>[
        [Colors.black, "#000000"]
        , [Colors.red, "#ff0000"]        
        , [Colors.green, "#00ff00"]        
        , [Colors.blue, "#0000ff"]        
        , [Colors.yellow, "#ffff00"]        
        , [Colors.white, "#ffffff"]
    ]).forEach(([color, hexString]) => {
        it(`GIVEN ${JSON.stringify(color)} THEN ${hexString}`, () =>
            expect(colorToString(color)).toBe(hexString)
        );
    });   

});