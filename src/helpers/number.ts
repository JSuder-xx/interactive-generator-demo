export const range = (inclusiveStart: number, exlusiveEnd: number) =>
    // not production code - quick-to-code
    new Array(exlusiveEnd - inclusiveStart)
        .join("*")
        .split("*")
        .map((_, index) => index + inclusiveStart);

export const limit = (val: number, start: number, end: number) =>
    val < start ? start 
    : val > end ? end
    : val;
