import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPickerComponent } from './channel-picker.component';

describe('ChannelPickerComponent', () => {
  let component: ChannelPickerComponent;
  let fixture: ComponentFixture<ChannelPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
