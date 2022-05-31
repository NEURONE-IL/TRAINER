import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MedalDialogComponent } from '../medal-dialog/medal-dialog.component';


@Component({
    selector: 'app-medal-showcase',
    templateUrl: './medal-showcase.component.html',
    styleUrls: ['./medal-showcase.component.css']
})
export class MedalShowcaseComponent implements OnInit {

    storyId                 : number;
    cantidadDeHistorias     : number = 2;
    lastCharacter           : string;

    @Input() totalDeEtapas: number;
    @Input() etapasCompletadas: number;
    @Input() userId: string;

    constructor(
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.lastCharacter = this.userId.slice(this.userId.length - 1);
        this.storyId = parseInt(this.lastCharacter, 16) % this.cantidadDeHistorias;

    }

    // Primera medalla se asigna por el primer login, por lo tanto siempre estara desbloqueado
    // condicionMedallaA() : boolean {}

    // Segunda medalla se asigna por completar la primera etapa
    condicionMedallaB(): boolean {
        if (this.etapasCompletadas >= 1) {
            return false;
        }
        else {
            return true;
        }
    }

    // Tercera medalla se asigna por completar la mitad de etapas totales
    condicionMedallaC(): boolean {
        if (this.etapasCompletadas >= this.totalDeEtapas / 2) {
            return false;
        }
        else {
            return true;
        }
    }

    // Cuarta medalla se asigna por completar el 75% de las etapas totales
    condicionMedallaD(): boolean {
        if (this.etapasCompletadas >= (this.totalDeEtapas * 3) / 4) {
            return false;
        }
        else {
            return true;
        }
    }

    // Quinta medalla se asigna por completar todo el flujo (100% de etapas totales)
    condicionMedallaE(): boolean {
        if (this.etapasCompletadas == this.totalDeEtapas) {
            return false;
        }
        else {
            return true;
        }
    }

    openMedalDialog(lockStatus: boolean, medalID: string) {

        let objeto = {
            lockStatus,
            medalID,
            storyId: this.storyId
        }

        this.dialog.open(MedalDialogComponent, { data: objeto })

    }


}