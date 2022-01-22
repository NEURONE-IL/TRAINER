import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../services/videoModule/quiz.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-video-module-admin',
  templateUrl: './videoModule-admin.component.html',
  styleUrls: ['./videoModule-admin.component.css']
})
export class AdminVideoModuleComponent implements OnInit {

  videos;

  constructor( private quizService: QuizService,
               private translate: TranslateService,
               private toastr: ToastrService,
               private router: Router) { }


  ngOnInit(): void {
    console.log('Admin Video Module');
    this.videos = this.getVideos();
  }

  getCover(): string{
    return '../../../assets/stage-images/02Video.jpg';
  }

  reloadVideos() {
    this.videos = this.getVideos();
  }

  getVideos() {
    return this.quizService.getVideos();
  }

  videoEdit() {
    console.log("Editar");
  }
  openVideoCreation(){
    console.log("Add Video");
  }

  confirmVideoDelete(id: number) {
    confirm(this.translate.instant("VIDEOS.TOAST.DELETE_CONFIRMATION")) && this.deleteVideo(id);
  }

  deleteVideo(id: number){
    this.quizService.deleteVideo(id);
    console.log("Borrado");
    this.toastr.success(this.translate.instant("VIDEOS.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("VIDEOS.TOAST.SUCCESS"),{
      timeOut: 5000,
      positionClass: 'toast-top-center'
    });
    this.router.navigate(['admin_videoModule']);
  }

  reloadQuizzes() {
    console.log("reload quizes");
  }
}
