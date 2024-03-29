import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { PlyrComponent, PlyrModule } from 'ngx-plyr';
import { QuizService } from '../../services/videoModule/quiz.service';
import { StageService } from '../../services/trainer/stage.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ???
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  @Input() videoNumber: number;
  @Output() newItemEvent = new EventEmitter<string>();

  @Input() saveUserData: string;
  player: Plyr;
  poster;
  youtubeSources = [
    {
      src: '',
      provider: 'youtube',
    },
  ];

  videoSources: Plyr.Source[];
  currentTime = 0;
  videoJson;
  stageId;
  userId;
  flowId;
  loadingVideo = true;

  constructor(
    private plyrModule: PlyrModule,
    private quizService: QuizService,
    private stageService: StageService
  ) {}

  played(event: Plyr.PlyrEvent) {
    let eventFinal;
    if (event.type === 'play') {
      eventFinal = 'Play en ' + this.player.currentTime + ' s.';
    } else if (event.type === 'pause') {
      eventFinal = 'Pause en ' + this.player.currentTime + ' s.';
    } else if (event.type === 'ratechange') {
      eventFinal =
        'Cambio de velocidad a ' +
        this.player.speed +
        ' en ' +
        this.player.currentTime +
        ' s.';
    } else if (event.type === 'enterfullscreen') {
      eventFinal = 'Pantalla completa en ' + this.player.currentTime + ' s.';
    } else if (event.type === 'exitfullscreen') {
      eventFinal =
        'Salir de pantalla completa en ' + this.player.currentTime + ' s.';
    } else if (event.type === 'volumechange') {
      /*else if (event.type === 'ended') {
      eventFinal = 'Video terminado. Tiempo total: ';
    }*/
      eventFinal =
        'Volumen cambio a ' +
        this.player.volume +
        ' en ' +
        this.player.currentTime +
        ' s.';
    } else if (event.type === 'seeked') {
      if (this.player.currentTime != this.currentTime) {
        let valor = this.player.currentTime;
        valor = parseFloat(valor.toFixed(2));
        eventFinal = 'Cambiar tiempo a ' + valor;
      }
    }
    if (eventFinal != null && this.saveUserData === 'Yes') {
      this.quizService
        .handleEvent(
          eventFinal,
          'video',
          this.userId,
          this.stageId,
          this.flowId
        )
        .subscribe((res) => {});
    }
  }

  play(): void {
    this.player.play();
    this.player.volume = 1;
    this.player.speed = 1;
  }

  ngOnInit(): void {
    // Get the video
    console.log('Buscamos... ');
    console.log(this.videoNumber);
    this.quizService.getVideo(this.videoNumber).subscribe((res) => {
      console.log(res);
      this.videoJson = res['data'];
      this.poster = this.videoJson.image_url;
      let ytSrc = this.checkYoutubeSrc(this.videoJson.video_url);
      if (ytSrc) {
        this.videoSources = [
          {
            src: this.videoJson.video_url,
            provider: 'youtube',
          },
        ];
      } else {
        this.videoSources = [
          {
            src: this.videoJson.video_url,
            type: 'video/mp4',
          },
        ];
      }
      this.loadingVideo = false;
    });

    this.stageId = localStorage.getItem('stageId');
    this.userId = JSON.parse(localStorage.getItem('currentUser'))._id;
    this.stageService.getStage(this.stageId).subscribe((res) => {
      this.flowId = res['stage'].flow;
    });
  }

  checkYoutubeSrc(url) {
    let youtubeSrc = url.includes('youtube');
    console.log('IS THIS A YOUTUBE SRC?');
    console.log(youtubeSrc);
    return youtubeSrc;
  }
  /*
  sendVideoResponse(value) {
    this.newItemEvent.emit(value);
  }

  pause() {
    console.log('pause');
  }*/
}
