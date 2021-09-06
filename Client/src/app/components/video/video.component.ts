import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
//import Plyr from 'plyr';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ???
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  @Input() videoNumber: number;
  @Output() newItemEvent = new EventEmitter<string>();

  constructor( ) { }

  ngOnInit(): void {
    this.getVideo();
    //const player = new Plyr('#player');
  }

  getVideo() {
    console.log('video');
  }

  sendVideoResponse(value) {
    this.newItemEvent.emit(value);
  }

}
