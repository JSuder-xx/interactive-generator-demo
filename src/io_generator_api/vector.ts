import { Rectangle } from "./rectangle";

export type Vector = {
    x: number;
    y: number;
}

export const originVector: Readonly<Vector> = { x: 0, y: 0 };

export const distanceBetweenVectors = (vect1: Vector, vect2: Vector) => {
    const x = vect1.x - vect2.x;
    const y = vect1.y - vect2.y;
    return Math.sqrt((x * x) + (y * y));
}

export const diffVector = (vect1: Vector, vect2: Vector): Vector =>
    ({
        x: vect1.x - vect2.x,
        y: vect1.y - vect2.y
    });

export const addVector = (vect1: Vector, vect2: Vector): Vector =>
    ({
        x: vect1.x + vect2.x,
        y: vect1.y + vect2.y
    });

export const multVector = (vect: Vector, scalar: number): Vector =>
    ({
        x: vect.x * scalar,
        y: vect.y * scalar
    });

export const normalize = (vect: Vector): Vector =>
    multVector(vect, 1 / distanceBetweenVectors(originVector, vect));


export const isVectorInRectangle = ({ left, top, right, bottom }: Rectangle, { x, y }: Vector) =>
    x >= left
    && x < right
    && y >= top
    && y < bottom;

const degreesToRads = (degs: number) =>
    (degs * Math.PI) / 180;

export const vectorPolarOffset = ({vector, degrees, radius}: {
    vector: Vector;
    degrees: number;
    radius: number
}) => {
    const rads = degreesToRads(degrees);
    return addVector(
        vector,
        { x: Math.sin(rads) * radius, y: Math.cos(rads) * radius }
    )
};
