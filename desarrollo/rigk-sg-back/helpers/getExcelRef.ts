export const getReferenceExcel = (col:any) =>{
    let dividend = col+2;
    let columnName = '';
    let modulo;

    while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName;
        dividend = Math.floor((dividend - modulo) / 26);
    }
    
    let reference = columnName + "1";
    return reference;
};