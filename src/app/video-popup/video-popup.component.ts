import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-video-popup',
  templateUrl: './video-popup.component.html',
  styleUrls: ['./video-popup.component.scss']
})
export class VideoPopupComponent implements OnInit {
  public showVideoPlayerFlg = false;
  public currentVideo: any;
  public videos = [
    { seconds: 41, src: 'http://www.superpowersgame.com/superpowers480.mov'},
    { seconds: 325, src: 'http://www.superpowersgame.com/videos/SPGamePlay480.mov'},
    { seconds: 24, src: 'http://www.superpowersgame.com/videos/homescreen.mov'},
  ];

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#videoPopup").modal();
  }
  playVideo(num: number) {
    this.showVideoPlayerFlg = true;
    setTimeout(() => {
      this.startPlayingVideo(num);
    }, 500);
  }
  startPlayingVideo(num: number) {
    this.currentVideo = <HTMLVideoElement>document.getElementById('mainVideo');
    var vid = this.videos[num-1];
    if (this.currentVideo) {
      this.currentVideo.src = vid.src;
      this.currentVideo.play();
      setTimeout(() => {
        this.turnOffVideo();
      }, vid.seconds * 1000);
    }

  }
  playDemoVideo() {
    this.showVideoPlayerFlg = true;
    setTimeout(() => {
      this.startPlayingDemoVideo();
    }, 500);
  }
  startPlayingDemoVideo() {
    this.currentVideo = <HTMLVideoElement>document.getElementById('mainVideo');
    if (this.currentVideo) {
      this.currentVideo.src = 'http://www.superpowersgame.com/videos/SPGamePlay480.mov';
      this.currentVideo.play();
      setTimeout(() => {
        this.turnOffVideo();
      }, 325000);
    }
  }
  turnOffVideo() {
    console.log('off!');
    this.currentVideo.pause();
    this.showVideoPlayerFlg = false;
  }
}
