import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlyrComponent, PlyrModule} from 'ngx-plyr';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ???
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  @Input() videoNumber: number;
  @Output() newItemEvent = new EventEmitter<string>();
  player: Plyr;
  poster;
  videoSources: Plyr.Source[];
  currentTime = 0;


  constructor( private plyrModule: PlyrModule ) { }



  played(event: Plyr.PlyrEvent) {
    if (event.type === 'play'){
      console.log('Play en ', this.player.currentTime, ' s.');
    }
    else if (event.type === 'pause'){
      console.log('Pause en ', this.player.currentTime, ' s.');
    }
    else if (event.type === 'ratechange'){
      console.log('Cambio de velocidad a ', this.player.speed, ' en ', this.player.currentTime, ' s.');
    }
    else if (event.type === 'enterfullscreen'){
      console.log('Pantalla completa en ', this.player.currentTime, ' s.');
    }
    else if (event.type === 'exitfullscreen'){
      console.log('Salir de pantalla completa en ', this.player.currentTime), ' s.';
    }
    else if (event.type === 'ended') {
      console.log('Video terminado. Tiempo total: ');
    }
    else if (event.type === 'volumechange'){
      console.log('Volumen cambio a ', this.player.volume, ' en ', this.player.currentTime), ' s.';
    }
    else if (event.type === 'seeked'){
      if(this.player.currentTime != this.currentTime){
        let valor = this.player.currentTime;
        valor = parseFloat(valor.toFixed(2));
        console.log('Cambiar tiempo a ', valor);
      }
    }
  }


  play(): void {
    this.player.pip = false; // Hemos sido timados
    this.player.play();
  }


  ngOnInit(): void {
    this.getVideo();
    this.poster = '/assets/videoModule-images/banner-video' + this.getVideo() + '.jpg';
    this.videoSources = [
      {
        src: '/assets/videoModule-videos/video' + this.getVideo() + '.mp4',
        type: 'video/mp4'
      }
    ];
  }


  getVideo() {
    return this.videoNumber;
  }


  sendVideoResponse(value) {
    this.newItemEvent.emit(value);
  }

  pause() {
    console.log('pause');
  }
}
