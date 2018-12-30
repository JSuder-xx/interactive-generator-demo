export const flatMap = <In, Out>(arr: In[], fn: (input: In) => Out[]): Out[] =>
    (<Out[]>[]).concat.apply([], arr.map(fn));


export const randomFrom = <T>(arr: T[]) => {
    const len = arr.length;    
    return (): T => 
        arr[Math.floor(Math.random() * len)];
}

export function isUniqueInPresortedArray<T>(sortedArray: T[]): boolean {
    const { length } = sortedArray;
    const lastIndex = length - 1;
    return sortedArray.every((val, index) =>
        index < lastIndex
            ? val !== sortedArray[index + 1]
            : true
    );
}
