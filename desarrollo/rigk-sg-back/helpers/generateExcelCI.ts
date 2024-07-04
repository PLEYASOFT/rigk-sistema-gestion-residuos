export const calcularSumaPesoDeclarado = (response: any[], subcategoria: string): string => {
    const totalPeso = response.filter((item: { SUBCATEGORIA: string; TRATAMIENTO: string }) => 
        item.SUBCATEGORIA === subcategoria && 
        (item.TRATAMIENTO === "Reciclaje Mecánico" || item.TRATAMIENTO === "Reciclaje Interno")
    );
    return totalPeso.reduce((suma: number, item: { PESO_DECLARADO: number }) => suma + item.PESO_DECLARADO, 0);
}

export const calcularSumaPesoValorizado = (response: any[], subcategoria: string): string => {
    const totalPeso = response.filter((item: { SUBCATEGORIA: string; TRATAMIENTO: string }) => 
        item.SUBCATEGORIA === subcategoria && 
        (item.TRATAMIENTO === "Reciclaje Mecánico" || item.TRATAMIENTO === "Reciclaje Interno" || item.TRATAMIENTO === "Valorización Energética")
    );
    return totalPeso.reduce((suma: number, item: { PESO_VALORIZADO: number }) => suma + item.PESO_VALORIZADO, 0);
}

export const calcularSumaPesoNoValorizado = (response: any[], subcategoria: string): string => {
    const totalPeso = response.filter((item: { SUBCATEGORIA: string; TRATAMIENTO: string }) => 
        item.SUBCATEGORIA === subcategoria && 
        (item.TRATAMIENTO === "Disposición Final en RS" || item.TRATAMIENTO === "DF en Relleno Seguridad")
    );
    return totalPeso.reduce((suma: number, item: { PESO_DECLARADO: number }) => suma + item.PESO_DECLARADO, 0);
}

export const calcularSumaPesoRegion = (response: any[], region: string): string => {
    const totalPeso = response.filter((item: { REGION: string; TRATAMIENTO: string }) => 
        item.REGION === region && 
        (item.TRATAMIENTO === "Reciclaje Mecánico" || item.TRATAMIENTO === "Reciclaje Interno" || item.TRATAMIENTO === "Valorización Energética")
    );
    return totalPeso.reduce((suma: number, item: { PESO_VALORIZADO: number }) => suma + item.PESO_VALORIZADO, 0);
}