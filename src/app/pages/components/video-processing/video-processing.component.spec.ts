import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoProcessingComponent } from './video-processing.component';

describe('VideoProcessingComponent', () => {
  let component: VideoProcessingComponent;
  let fixture: ComponentFixture<VideoProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoProcessingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
