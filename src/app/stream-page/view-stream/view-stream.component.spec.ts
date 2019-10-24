import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStreamComponent } from './view-stream.component';

describe('ViewStreamComponent', () => {
  let component: ViewStreamComponent;
  let fixture: ComponentFixture<ViewStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
