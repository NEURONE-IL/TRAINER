//Pipe para cambiar el tipo de etapa. Resulta problematico que se muestre "SG" como tipo de etapa
//TODO? cambiar video + quiz a un nombre mas presentable?

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoEtapa'
})
export class TipoEtapaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch(value){
      case "SG":
        return "Aventura";
      default:
        return value;
    }
  }

}
