import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StoreTrackService } from './store-track.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsTrackerService {
  isTracking = false;
  boundFunctions = [];

  user: any;

  constructor(
    private auth: AuthService,
    private storeService: StoreTrackService
  ) {}

  start() {
    if (!this.isTracking) {
      console.log('-----------------------------------');
      console.log('START ActionsTracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      let data = {
        w: window,
        d: document,
        e: document.documentElement,
        g: document.getElementsByTagName('body')[0],
      };

      /*Custom events*/
      this.bindEvent(targetDoc, 'openhelpmodal', data, this.openhelpmodalListener);
      this.bindEvent(targetDoc, 'closehelpmodal', data, this.closehelpmodalListener);
      this.bindEvent(targetDoc, 'stageenter', data, this.stageenterListener);
      this.bindEvent(targetDoc, 'pageenter', data, this.pageenterListener);
      this.bindEvent(targetDoc, 'pageexit', data, this.pageexitListener);
      /*End custom events*/
      this.isTracking = true;
    }
  }

  stop() {
    if (this.isTracking) {
      console.log('-----------------------------------');
      console.log('STOP ActionsTracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      /*Custom events*/
      this.unbindAll(targetDoc, 'openhelpmodal');
      this.unbindAll(targetDoc, 'closehelpmodal');
      this.unbindAll(targetDoc, 'stageenter');
      this.unbindAll(targetDoc, 'pageenter');
      this.unbindAll(targetDoc, 'pageexit'); 
      /*End custom events*/
      this.unbindData(targetDoc);
      this.isTracking = false;
    }
  }

  bindEvent(elem, evt, data, fn) {
    this.boundFunctions.push(fn);
    elem.addEventListener(evt, fn);
    elem.data = data;
    elem.storeService = this.storeService;
    this.user = {
      id: this.auth.getUser()._id,
      email: this.auth.getUser().email,
      flow: this.auth.getUser().flow
    }
    elem.user = this.user;
  }

  unbindAll(elem, evt) {
    this.boundFunctions.forEach((boundFn) => {
      elem.removeEventListener(evt, boundFn);
    });
  }

  unbindData(elem) {
    delete elem.data;
    delete elem.storeService;
  }

  openhelpmodalListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      flowId: this.user.flow,
      stageId: localStorage.getItem('stageId'),
      source: 'HelpModal',
      type: 'OpenHelpModal',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }

  closehelpmodalListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      flowId: this.user.flow,
      stageId: localStorage.getItem('stageId'),
      source: 'HelpModal',
      type: 'CloseHelpModal',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }   

  stageenterListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      flowId: this.user.flow,
      stageId: localStorage.getItem('stageId'),  
      source: 'Window',
      type: 'StageEnter',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  pageenterListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      flowId: this.user.flow,
      stageId: localStorage.getItem('stageId'),  
      source: 'Window',
      type: 'PageEnter',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  pageexitListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      flowId: this.user.flow,
      stageId: localStorage.getItem('stageId'), 
      source: 'Window',
      type: 'PageExit',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }   

}