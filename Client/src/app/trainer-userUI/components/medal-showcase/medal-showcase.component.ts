import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrainerUserUIService } from '../../services/trainer-user-ui.service';
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
    @Input() flowId: string;

    constructor(
        private dialog: MatDialog,
        private trainerUserUIService: TrainerUserUIService
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

        let objEvento = {
            user: this.userId,
            flow: this.flowId,
            medal: medalID,
            eventDescription: "User has clicked medal " + medalID
          }

        this.trainerUserUIService.saveEvent(objEvento).subscribe();

        let objeto = {
            lockStatus,
            medalID,
            storyId: this.storyId
        }

        const dialogRef = this.dialog.open(MedalDialogComponent, { data: objeto });

        dialogRef.afterClosed().subscribe(() => {
            let objEvento = {
                user: this.userId,
                flow: this.flowId,
                medal: medalID,
                eventDescription: "User has closed medal dialog " + medalID
              }
    
            this.trainerUserUIService.saveEvent(objEvento).subscribe();
        });

    }


}