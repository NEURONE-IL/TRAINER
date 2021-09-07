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
    console.log('played', event);
  }


  play(): void {
    this.player.play();
  }


  ngOnInit(): void {
    this.getVideo();
    this.poster = "/assets/videoModule-images/banner-video" + this.getVideo() + ".jpg";
    this.videoSources = [
      {
        src: '/assets/Video_busqueda' + this.getVideo() + '.mp4',
        type: "video/mp4"
      }
    ];
  }


  getVideo() {
    return this.videoNumber;
  }


  sendVideoResponse(value) {
    this.newItemEvent.emit(value);
  }

}
