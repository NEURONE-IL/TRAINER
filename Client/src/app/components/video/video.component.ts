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


  constructor( private plyrModule: PlyrModule ) { }



  played(event: Plyr.PlyrEvent) {
    if (event.type === 'play'){
      console.log('play on ', this.player.currentTime);
    }
    else if (event.type === 'pause'){
      console.log('pause on ', this.player.currentTime);
    }
    else if (event.type === 'ratechange'){
      console.log('cambio de speed to ', this.player.speed);
    }
    else if (event.type === 'enterfullscreen'){
      console.log('pantalla completa on ', this.player.currentTime);
    }
    else if (event.type === 'exitfullscreen'){
      console.log('salir de pantalla completa on ', this.player.currentTime);
    }
    else if (event.type === 'ended') {
      console.log('video terminado');
    }
    else if (event.type === 'volumechange'){
      console.log('volumen cambio a ', this.player.volume, ' on time ', this.player.currentTime);
    }
    else if (event.type === 'seeking'){ // Estos no funcionan bien bien
      console.log('mover desde ', this.player.currentTime);
    }
    else if (event.type === 'seeked'){
      console.log('y dejar on ', this.player.currentTime);
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
