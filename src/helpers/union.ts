/** 
 * An accessory for union type exhaustiveness checking. 
 * This requires an uninhabited value and therefore throws a compile error if the value has any type.
 * Call this from the final else block of a chain of if/else with type guards.
 **/
export const callWithNever = (noVal: never): void => {};
