import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseBodyComponent } from './response-details.component';

describe('ResponseBodyComponent', () => {
  let component: ResponseBodyComponent;
  let fixture: ComponentFixture<ResponseBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});