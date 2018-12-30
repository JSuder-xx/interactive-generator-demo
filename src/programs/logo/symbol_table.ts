import { Variable, ProcedureDefinition } from "./ast";

type SymbolFrame = { [index: string]: Variable | ProcedureDefinition | number };

export default class SymbolTable {
    
    private readonly _frames: SymbolFrame[] = [{}]; // START with a top level
    
    public lookup(name: string): Variable | ProcedureDefinition | number | null {
        const { _frames } = this;
        let idx = _frames.length - 1;
        while (idx >= 0) {
            const frame = _frames[idx];
            const result = frame[name];
            if (result !== undefined)
                return result;
            idx--;
        }

        return null;
    }

    public pushFrame() {
        this._frames.push({});            
    }

    public popFrame() {
        if (this._frames.length < 2)
            throw new Error("Cannot pop top frame.");
        this._frames.pop();
    }

    public declare(name: string, symbolValue: Variable | ProcedureDefinition | number) {
        const topFrame = this._frames[this._frames.length - 1];
        if (!topFrame)
            throw new Error("Expecting top frame");
        topFrame[name] = symbolValue;
    }
    
}
