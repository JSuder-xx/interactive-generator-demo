export function* join<T>(itIt: IterableIterator<IterableIterator<T>>): IterableIterator<T> {
    for(let iterator of itIt) {
        yield* iterator;
    }
}

export function* filter<T>(it: IterableIterator<T>, pred: (input: T) => boolean) {
    for(let value of it) {
        if (pred(value))
            yield value;
    }
}

export function* map<TIn, TOut>(inIterator: IterableIterator<TIn>, fn: (input: TIn) => TOut) {
    for(let value of inIterator) {
        yield fn(value);          
    }
}

export function flatMap<TIn, TOut>(inIteraor: IterableIterator<TIn>, fn: (input: TIn) => IterableIterator<TOut>) {
    return join(map(inIteraor, fn));
}

export function* just<T>(val: T) {
    yield val;
}

export const unit = just;