import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more specific tests for AuthService here
  // For example:
  // it('should authenticate user', () => {
  //   const mockCredentials = { username: 'testuser', password: 'testpass' };
  //   const mockResponse = { token: 'fake-jwt-token' };
  //
  //   service.login(mockCredentials).subscribe(response => {
  //     expect(response).toEqual(mockResponse);
  //   });
  //
  //   const req = httpTestingController.expectOne('/api/login');
  //   expect(req.request.method).toBe('POST');
  //   expect(req.request.body).toEqual(mockCredentials);
  //   req.flush(mockResponse);
  // });

  // it('should store token in localStorage after successful login', () => {
  //   const mockResponse = { token: 'fake-jwt-token' };
  //   spyOn(localStorage, 'setItem');
  //
  //   service.login({ username: 'testuser', password: 'testpass' }).subscribe();
  //
  //   const req = httpTestingController.expectOne('/api/login');
  //   req.flush(mockResponse);
  //
  //   expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'fake-jwt-token');
  // });

  // it('should clear token and navigate to login page on logout', () => {
  //   spyOn(localStorage, 'removeItem');
  //   service.logout();
  //   expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  // });
});