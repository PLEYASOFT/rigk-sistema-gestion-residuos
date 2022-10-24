import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  inicialesNombre(nombre: string) {

    let primeraLetra = '';
    let segundaLetra = '';
    try {
    let arrayIniciales = nombre.split(' ');
      if (Array.isArray(arrayIniciales)) {
        if (arrayIniciales[0]) {
          let nombreSplit = arrayIniciales[0].split('');
          primeraLetra = nombreSplit[0];
        }
        if (arrayIniciales[1]) {
          let apellidoSplit = arrayIniciales[1].split('');
          segundaLetra = apellidoSplit[0];
        }
      }
    } catch {
      undefined;
    } finally {
      return primeraLetra + segundaLetra;
    }
  }
}
