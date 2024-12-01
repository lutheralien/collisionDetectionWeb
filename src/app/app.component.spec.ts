import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let titleService: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [Title]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'prepArchiveWeb'`, () => {
    expect(component.title).toEqual('prepArchiveWeb');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('prepArchiveWeb');
  });

  it('should set the document title', () => {
    expect(titleService.getTitle()).toBe('prepArchiveWeb');
  });

  it('should update the document title when component initializes', () => {
    component.ngOnInit();
    expect(titleService.getTitle()).toBe('prepArchiveWeb');
  });
});