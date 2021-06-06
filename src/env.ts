import { DataType, Symbol } from "./types.js";

export interface SymbolTable {
    [key: string]: DataType;
}

export interface Environment {
    setValue: (key: string, value: DataType) => DataType;
    getValue: (key: string) => DataType | null;
    getTable: () => SymbolTable;
}

export function createEnvironment(binds: Symbol[], exprs: DataType[], outer?: Environment) {

    const symbols: SymbolTable = {};

    binds.forEach((b, i) => { symbols[b.value] = exprs[i]; });

    function setValue(key: string, value: DataType) {
        console.log("addding ", key, value);
        symbols[key] = value;
        return value
    };

    function getValue(key: string) {
        if (key in symbols) return symbols[key];
        else if (outer) return outer.getValue(key);
        else return null;
    };

    function addSymbols(table: SymbolTable) {
        Object.entries(table).map(entry => {
            symbols[entry[0]] = entry[1];
        });
    }

    function getTable() {
        return symbols;
    }

    return { setValue, getValue, addSymbols, getTable };

}
