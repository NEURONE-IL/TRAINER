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
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;

  constructor(
    private plyrModule: PlyrModule,
  ) { }

  // or get it from plyrInit event
  player: Plyr;

  videoSources: Plyr.Source[] = [
    {
      src: 'bTqVqk7FSmY',
      provider: 'youtube',
    },
  ];

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }
  ngOnInit(): void {
    this.getVideo();
  }

  getVideo() {
    console.log('video');
  }

  sendVideoResponse(value) {
    this.newItemEvent.emit(value);
  }

}
