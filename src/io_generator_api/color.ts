import { flatMap } from "../helpers/array";
import { range } from "../helpers/number";

export type BrightnessMarker = { __kind: "Brightness" };

/** Represents the intensity of a given color channel. */
export type Brightness = number & BrightnessMarker;

export const brightnesses: Brightness[] = range(0, 256) as Brightness[];

export const isBrightness = (num: number): num is Brightness =>
    (num >= 0) && (num <= 255);

export const limitToBrightness = (num: number): Brightness =>
    (
        num < 0 ? 0
        : num > 255 ? 255
        : num
    ) as Brightness;

export type Color = { 
    red: Brightness; 
    green: Brightness; 
    blue: Brightness; 
}

export const colorMaybe = (red: number, green: number, blue: number) =>
    isBrightness(red) && isBrightness(green) && isBrightness(blue)
        ? { red, green, blue }
        : null;

export const colorOrThrow = (red: number, green: number, blue: number) => {
    const color = colorMaybe(red, green, blue);
    if (color !== null)
        return color;
    throw new Error(`${red} ${green} ${blue} has a color channel out of bounds.`);
}

export const brightnessToHex = (brightness: Brightness): string => {
    const hex = brightness.toString(16);
    return hex.length < 2 
        ? `0${hex}`
        : hex;
}

export const colorToString = (color: Color) =>
    `#${brightnessToHex(color.red)}${brightnessToHex(color.green)}${brightnessToHex(color.blue)}`;

export module Colors {

    export const binaryBrightness = [0, 255] as Brightness[];

    // obnoxious way to generate colors but the declarative nature enables changing channel brightness resolution
    export const [ black, blue, green, cyan, red, magenta, yellow, white ]: Color[] = flatMap(binaryBrightness, red =>
        flatMap(binaryBrightness, green =>
            flatMap(binaryBrightness, blue => [{ red, green, blue }])
        )
    ); 

    export const [darkGray, mediumGray, lightGray]: Color[] = (<Brightness[]>[64, 128, 224]).map(channel => ({ red: channel, green: channel, blue: channel }));

}
