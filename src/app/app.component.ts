import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'data-realtime-visualize';
  arrayData = [];
  constructor(private http: HttpClient) {
    this.arrayData = [];
    let apiURL = `https://cors-anywhere.herokuapp.com/http://54.161.120.145:9696/apis/get-all-root`;
    this.http.get(apiURL).toPromise().then(
        (res: CustomResponse) => {
         this.arrayData = res.data;
      },
      error => {
        console.log('error: ', error)
      }
    );
  }
  clickNode(nodeId){
    let itemClick = null;
    let indClick = -1;
    _.each(this.arrayData, (item, ind) => {
      if(nodeId === item.id){
        itemClick = item;
        indClick = ind;
      }
    });
    console.log('node: ', itemClick);
    console.log('ind: ', indClick);
    if(itemClick.nodeType === 'node' && itemClick.clicked === false){
      this.arrayData[indClick].clicked = true;
      let apiURL = `https://cors-anywhere.herokuapp.com/http://54.161.120.145:9696/apis/get-child/${nodeId}`;
      this.http.get(apiURL).toPromise().then(
          (res: CustomResponse) => {
          console.log('res.data: ', res.data);
          const arrFirst = this.arrayData.slice(0, indClick + 1);
          const arrEnd = this.arrayData.slice(indClick + 1);
          console.log('arrFirst: ', arrFirst);
          console.log('arrEnd: ', arrEnd);
          _.each(res.data, i => {
            arrFirst.push(i);
          });
          _.each(arrEnd, i => {
            arrFirst.push(i);
          });
          console.log('arr: ', arrFirst);
          this.arrayData = arrFirst;
          console.log(this.arrayData);
        },
        error => {
          console.log('error: ', error)
        }
      );
    }
  }
}
export interface CustomResponse {
    data: any;
}
