import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullComponent } from './full.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('FullComponent', () => {
  let component: FullComponent;
  let fixture: ComponentFixture<FullComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullComponent],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
        // Add any other services that FullComponent depends on
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FullComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no unmatched requests are outstanding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more specific tests for FullComponent here
  // For example:
  // it('should have expected panel after animation', fakeAsync(() => {
  //   component.togglePanel();
  //   tick(); // Simulate the passage of time until all pending asynchronous activities complete
  //   fixture.detectChanges();
  //   expect(component.isPanelOpen).toBeTruthy();
  // }));
});