import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

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
  }

  getVideo() {
    console.log("video");
  }

  sendVideoResponse() {
    const send = 'video ' + this.videoNumber.toString(10) + ' listo!'
    this.newItemEvent.emit(send);
  }

}
