import {Component, OnInit} from '@angular/core';
import {Command, EventType, HttpRequestEvent, RequestService, UriTemplateEvent} from './request.service';
import * as $ from 'jquery';
import {AppService, RequestHeader} from '../app.service';

@Component({
  selector: 'app-url-input',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  uri: string;
  uriTemplateEvent: UriTemplateEvent = new UriTemplateEvent(EventType.FillUriTemplate, '', []);
  httpRequestEvent: HttpRequestEvent = new HttpRequestEvent(EventType.FillHttpRequest, Command.Post, '');
  newRequestUrl: string;
  postRequestBody: string;
  selectedHttpMethod: Command;
  commandPlaceholder = Command;
  requestHeaders: RequestHeader[];
  tempRequestHeaders: RequestHeader[];
  hasCustomRequestHeaders: boolean;

  constructor(private appService: AppService, private requestService: RequestService) {
  }

  ngOnInit() {
    this.uri = this.appService.getUrl();

    this.tempRequestHeaders = this.appService.getCustomRequestHeaders();

    this.requestService.getNeedInfoObservable().subscribe((value: any) => {
      if (value.type === EventType.FillUriTemplate) {
        const event: UriTemplateEvent = <UriTemplateEvent>value;
        this.uriTemplateEvent = event;
        this.inputChanged();
        $('#requestModalTrigger').trigger( 'click' );
      } else if (value.type === EventType.FillHttpRequest) {
        const event: HttpRequestEvent = <HttpRequestEvent>value;
        this.httpRequestEvent = event;
        this.inputChanged();
        this.selectedHttpMethod = event.command;
        $('#HttpRequestTrigger').trigger( 'click' );
      }
    });

    this.appService.urlObservable.subscribe(url => this.goFromHashChange(url));
    this.appService.requestHeadersObservable.subscribe(requestHeaders => {
      this.tempRequestHeaders = requestHeaders;
      this.updateRequestHeaders();
    });

    this.updateRequestHeaders();
    this.getUri();
  }

  public getUri() {
    this.requestService.getUri(this.uri);
  }

  public getExpandedUri() {
    this.requestService.getUri(this.newRequestUrl);
  }

  public createOrUpdateResource() {
    this.requestService.requestUri(this.httpRequestEvent.uri, Command[this.selectedHttpMethod], this.postRequestBody);
  }

  public goFromHashChange(url: string) {
    this.uri = url;
    this.requestService.getUri(this.uri);
  }

  public inputChanged() {
    const templatedUrl = this.uriTemplateEvent.templatedUrl;
    this.newRequestUrl = templatedUrl.substring(0, templatedUrl.indexOf('{'));
    let separator = '?';
    for (const parameter of this.uriTemplateEvent.parameters) {
      if (parameter.value.length > 0) {
        this.newRequestUrl = this.newRequestUrl + separator + parameter.key + '=' + parameter.value;
        separator = '&';
      }
    }
  }

  public showEditHeadersDialog() {
    this.tempRequestHeaders = new Array();
    for (let i = 0; i < 5; i++) {
      if (this.requestHeaders.length > i) {
        this.tempRequestHeaders.push(new RequestHeader(this.requestHeaders[i].key, this.requestHeaders[i].value));
      } else {
        this.tempRequestHeaders.push(new RequestHeader('', ''));
      }
    }

    $('#requestHeadersModalTrigger').trigger( 'click' );
  }

  public updateRequestHeaders() {
    this.requestHeaders = new Array();
    for (let i = 0; i < this.tempRequestHeaders.length; i++) {
      const key: string = this.tempRequestHeaders[i].key.trim();
      const value: string = this.tempRequestHeaders[i].value.trim();

      if (key.length > 0 && value.length > 0) {
        this.requestHeaders.push(new RequestHeader(key, value));
      }
    }
    this.requestService.setCustomHeaders(this.requestHeaders);
    this.hasCustomRequestHeaders = this.requestHeaders.length > 0;
    this.appService.setCustomRequestHeaders(this.requestHeaders);
  }
}


