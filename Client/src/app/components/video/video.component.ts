import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  encapsulation: ViewEncapsulation.None, // ???
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  constructor( ) { }

  ngOnInit(): void {
  }

}
