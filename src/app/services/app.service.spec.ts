import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AppService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more tests here for your service methods
  // For example:
  // it('should fetch data', () => {
  //   service.fetchData().subscribe(data => {
  //     expect(data).toBeTruthy();
  //   });
  //
  //   const req = httpTestingController.expectOne('your-api-url');
  //   expect(req.request.method).toEqual('GET');
  //   req.flush({ someData: 'test' });
  // });
});