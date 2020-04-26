import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var convertStringToDate: any;
declare var $: any;

@Component({
  selector: 'app-forum-popup',
  templateUrl: './forum-popup.component.html',
  styleUrls: ['./forum-popup.component.scss']
})
export class ForumPopupComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;
  public category;
  public forumPost;
  public forumTopics;
  public forumPosts;
  public forumMessages;
  public dateStampText;
  public dateStamp;
  public selectedTopic;
  public selectedPost;
  public showFormFlg = false;
  public newPostFlg = false;

  constructor() { super(); }

  ngOnInit(): void {

  }
  show() {
    this.loadCategories();
    // console.log(this.user);
    this.openModal('#forumPopup');
  }
  loadCategories() {
    this.forumTopics = [];
    this.forumPosts = [];
    this.forumMessages = [];
    this.showFormFlg = false;
    this.newPostFlg = false;
    var lastForumLogin = convertStringToDate(localStorage.lastForumLogin);
    var url = this.getHostname() + "/webForum.php";
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, lastForumLogin: localStorage.lastForumLogin, type: '1' });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data)) {
          this.category = 0;
          this.forumPost = 0;
          var items = data.split("<a>");
          this.forumTopics = [];
          this.forumPosts = [];
          this.forumMessages = [];
          var forumTopics = [];
          var dateStamp;
          var dateStampText;
          var adminFlg = this.user.gold_member_flg == 'Y';
          var icons = ['empty', 'fa-commenting', 'fa-bug', 'fa-thumbs-o-up', 'fa-lock', 'fa-lock', 'fa-book', 'fa-bookmark'];
          var x = 0;
          items.forEach(function (item) {
            var c = item.split("|");
            if (c.length > 5) {
              x++;
              dateStamp = convertStringToDate(c[6]);
              dateStampText = c[6];
              var dif = lastForumLogin.getTime() - dateStamp.getTime();
              var newFlg = (dif >= 0) ? 'N' : 'Y';
              if ((c[0] == '4' || c[0] == '5') && !adminFlg)
                return;
              forumTopics.push({ icon: icons[x], category: c[0], name: c[1], topic_count: c[2], post_count: c[3], user: c[4], userId: c[5], dateStamp: c[6], newFlg: newFlg });
            }
          });
          this.forumTopics = forumTopics;
          //console.log(forumTopics);
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  ngStyleForumCategory(topic: any) {
    if (this.selectedTopic && this.selectedTopic.category == topic.category)
      return { 'background-color': 'yellow' };
  }
  selectTopic(topic: any) {
    this.playClick();
    this.showFormFlg = false;
    this.newPostFlg = false;
    this.selectedTopic = topic;
    this.forumPosts = [];
    this.forumMessages = [];
    var lastForumLogin = convertStringToDate(localStorage.lastForumLogin);
    var url = this.getHostname() + "/webForum.php";
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, category: topic.category });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        //console.log(data);
        if (this.verifyServerResponse(data)) {
          var items = data.split("<a>");
          var forumPosts = [];
          items.forEach(function (item) {
            var c = item.split("|");
            var body = '';
            if (c.length > 7) {
              var regex = /(<([^>]+)>)/ig
              body = c[8].replace(regex, "");
            }
            if (c.length > 5) {
              var dateStamp = new Date(c[6]);
              var dif = lastForumLogin.getTime() - dateStamp.getTime();
              var newFlg = (dif >= 0) ? 'N' : 'Y';
              console.log('forumPosts newFlg', newFlg);
              forumPosts.push({ id: c[0], name: c[1], topic_count: c[2], post_count: c[3], user: c[4], userId: c[5], dateStamp: c[6], newFlg: newFlg, body: body, category: c[9] });
            }
          });
          this.forumPosts = forumPosts;
          //console.log(forumPosts);
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  selectPost(post: any) {
    this.playClick();
    this.showFormFlg = true;
    this.newPostFlg = false;
    this.selectedPost = post;
    this.forumPosts = [];
    this.forumMessages = [];
    var lastForumLogin = new Date(localStorage.lastForumLogin);
    console.log(post);
    var url = this.getHostname() + "/webForum.php";
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, category: post.category, forumPost: post.id });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        //console.log(data);
        if (this.verifyServerResponse(data)) {
          var items = data.split("<a>");
          var forumMessages = [];
          items.forEach(function (item) {
            var c = item.split("|");
            var body = '';
            if (c.length > 7) {
              var regex = /(<([^>]+)>)/ig
              body = c[8].replace(regex, "");
            }
            if (c.length > 5) {
              var dateStamp = new Date(c[6]);
              var dif = lastForumLogin.getTime() - dateStamp.getTime();
              var newFlg = (dif >= 0) ? 'N' : 'Y';
              forumMessages.push({ id: c[0], name: c[1], topic_count: c[2], post_count: c[3], user: c[4], userId: c[5], dateStamp: c[6], newFlg: newFlg, body: body, category: c[9], lastUser: c[10] });
            }
          });
          this.forumMessages = forumMessages;
          //console.log(forumMessages);
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });

  }
  postMessage() {
    this.playClick();
    var messageBody = this.databaseSafeValueOfInput('messageBody');
    if (messageBody.length == 0) {
      this.showAlertPopup('Message is blank!', 1);
      return;
    }
    var forumPost = 0;
    var messageTitle = '';
    var category = this.selectedTopic.category;

    if (this.newPostFlg) {
      messageTitle = this.databaseSafeValueOfInput('messageTitle');
      if (messageTitle.length == 0) {
        this.showAlertPopup('Title is blank!', 1);
        return;
      }
      $('#messageTitle').val('');
    } else {
      messageTitle = this.selectedPost.name;
      forumPost = this.selectedPost.id;
    }

    $('#messageBody').val('');
    this.showFormFlg = false;
    var url = this.getHostname() + "/webForum.php";
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, title: messageTitle, body: messageBody, action: 'newPost', category: category, forumPost: forumPost });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log(data);
        if (this.verifyServerResponse(data)) {
          this.loadCategories();
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });

  }
  startNewPost() {
    this.playClick();
    this.newPostFlg = true;
    this.showFormFlg = true;
    this.forumMessages = [];
    this.forumPosts = [];
  }
}
