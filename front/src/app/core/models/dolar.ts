import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Dolar {
  constructor(public valor: number, public fecha: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class DolarAdapter implements Adapter<Dolar> {
  adapt(item: any): Dolar {
    return new Dolar(item.valor, item.fecha);
  }
}
