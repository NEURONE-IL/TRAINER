import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { QuizService } from '../../services/videoModule/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VideoComponent } from '../video/video.component';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-video-mantainer-component',

  templateUrl: './video-mantainer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./video-mantainer.component.css']
})

export class VideoMantainerComponent implements OnInit{
  
  videos=[];
  constructor(private quizService: QuizService,
              public matDialog: MatDialog,
              private http: HttpClient,
              private toastr: ToastrService,
              private translate: TranslateService,
              private router: Router) {  }

 ngOnInit(): void{
  this.loadVideos();
 }

 loadVideos(){
  this.quizService.getVideos().subscribe(
    (res)=>{
      this.videos=[];
      for (let i in res.data){
        this.videos.push({
          name: res.data[i].name,
          language: res.data[i].language,
          _id: res.data[i]._id, 
          video_url: res.data[i].video_url,
          image_url: res.data[i].image_url,
        })
        console.log(this.videos)
      }
      this.videos.reverse();
    })
 }
  


loadImage(file){
  let formData = new FormData();
  formData.append('file', file);
  this.quizService.saveImage(formData).subscribe(
    (res)=>{
      console.log(res)
    }
  )
  return;
}
languageVideo="es";
error={
  name:false,
  url:false,
  file:false
};
validate(name, url, file, language){
  console.log(name, url, file, language);
  this.error.name=false; 
  this.error.url= false;
  this.error.file=false;
  if (!file){
    this.error.file=true;
  }
  if (name.length==0) this.error.name=true;
  if(url.length<10) this.error.url=true;
  if (this.error.name || this.error.url || this.error.file){
    return false
  }
  return true
}
cleanForm(){
  (document.getElementById("tituloVideo")  as HTMLInputElement).value="";
  (document.getElementById("imageVideo")  as HTMLInputElement).value=null;

  //limpiar campos de video falta. 
  (document.getElementById("video")  as HTMLInputElement).value=null;
  this.url=null;
}
registerVideo(){
  let name= (document.getElementById("tituloVideo")  as HTMLInputElement).value;
  let url_video= this.url;
  let file = (document.getElementById("imageVideo")  as HTMLInputElement).files[0];
  let language= this.languageVideo;
  let formData = new FormData();

  if (this.validate(name, url_video, file, language)){
    formData.append('file', file);
    this.quizService.saveImage(formData).subscribe(
     (res:any)=>{
       let image= res.url;
        let objetVideo={
          name: name, 
          video_url:url_video,
          image_url: image, 
          language:language
        }
        this.quizService.addVideo(objetVideo).subscribe(
          (res)=>{
            console.log(res);
            this.loadVideos();
            this.cleanForm();
          }
        )
     }
   )
  }
   
}
deleteVideo(videoId){
  this.quizService.deleteVideo(videoId).subscribe(
    (res)=>{
      this.loadVideos();
    }
  )
}

//VIDEO UPLOADER
url;
format;
loadingVideo= false;
onSelectFile(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      //verificar que el tipo sea video.
      if(file.type.indexOf('video')> -1){
        this.loadingVideo= true;
        this.format = 'video';

        //Guardar el video 
        let formData = new FormData();
        formData.append('file', file);
        this.quizService.saveImage(formData).subscribe(
          (res:any)=>{
            console.log(res)
            this.url= res.url;
            this.loadingVideo=false;
          }
        )

      }
    }
  }
}
