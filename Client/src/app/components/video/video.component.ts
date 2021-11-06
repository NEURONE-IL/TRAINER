import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlyrComponent, PlyrModule} from 'ngx-plyr';
import {QuizService} from '../../services/videoModule/quiz.service';


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


  constructor( private plyrModule: PlyrModule,
               private quizService: QuizService) { }



  played(event: Plyr.PlyrEvent) {
    let eventFinal;
    if (event.type === 'play'){
      eventFinal = 'Play en ' + this.player.currentTime + ' s.';
    }
    else if (event.type === 'pause'){
      eventFinal = 'Pause en ' + this.player.currentTime + ' s.';
    }
    else if (event.type === 'ratechange'){
      eventFinal = 'Cambio de velocidad a ' + this.player.speed + ' en ' + this.player.currentTime + ' s.';
    }
    else if (event.type === 'enterfullscreen'){
      eventFinal = 'Pantalla completa en ' + this.player.currentTime + ' s.';
    }
    else if (event.type === 'exitfullscreen'){
      eventFinal = 'Salir de pantalla completa en ' + this.player.currentTime + ' s.';
    }
    /*else if (event.type === 'ended') {
      eventFinal = 'Video terminado. Tiempo total: ';
    }*/
    else if (event.type === 'volumechange'){
      eventFinal = 'Volumen cambio a ' + this.player.volume + ' en ' + this.player.currentTime + ' s.';
    }
    else if (event.type === 'seeked'){
      if(this.player.currentTime != this.currentTime){
        let valor = this.player.currentTime;
        valor = parseFloat(valor.toFixed(2));
        eventFinal = 'Cambiar tiempo a ' + valor;
      }
    }
    if (eventFinal != null){
      //console.log("Evento: " + eventFinal);
      this.quizService.handleEvent(eventFinal, 'video').subscribe((res) => { });
    }
  }


  play(): void {
    this.player.play();
    this.player.volume = 1;
    this.player.speed = 1;
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

/*
  sendVideoResponse(value) {
    this.newItemEvent.emit(value);
  }

  pause() {
    console.log('pause');
  }*/
}
