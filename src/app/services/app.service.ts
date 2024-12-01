import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, interval, merge, of } from 'rxjs';
import { map, switchMap, takeWhile, filter, mergeMap, catchError, take, tap } from 'rxjs/operators';
import { baseurl } from '../constants/baseurl.contants';
import { ILogin } from '../models/users.model';
import { AppState } from '../state/app.state';
interface ProcessingStatus {
  progress: number;
  frame_count: number;
  total_frames: number;
  status: 'starting' | 'processing' | 'completed' | 'error';
}

interface ProcessingEvent {
  type: 'uploadProgress' | 'processingStatus' | 'complete';
  data: any;
  timestamp?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private http = inject(HttpClient);
  private apiUrl = baseurl;

  
  login(data: ILogin): Observable<any> {
    console.log(`${baseurl}/login`);
    
    return this.http.post(`${baseurl}/login`, data).pipe(
      take(1),
      catchError((err) => of(err)),
      tap((res) => {
        if (!res.success) {
          throw Error(res.error.message);
        }
      })
    );
  }
  refreshToken(token: any): Observable<any> {
    return this.http
      .post(`${baseurl}/token/refresh`, { refreshToken: token })
      .pipe(
        take(1),
        catchError((err) => of(err)),
        tap((res) => {
          if (!res.success) {
            throw Error(res.error.message);
          }
        })
      );
  }
  getUserById(id: string): Observable<any> {
    return this.http.get(`${baseurl}/common/get/${id}`).pipe(
      take(1),
      catchError((err) => of(err)),
      tap((res) => {
        if (!res.success) {
          throw Error(res.error.message);
        }
      }),
      map((res) => res.data)
    );
  } 
  processVideo(file: File): Observable<ProcessingEvent> {
    const formData = new FormData();
    formData.append('video', file);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    formData.forEach((value, key) => {
      console.log('FormData entry:', key, value);
    });
    return this.http.post<any>(
      `${this.apiUrl}/process-video`,
      formData,
      {
        observe: 'events',
        reportProgress: true
      }
    ).pipe(
      mergeMap((event: HttpEvent<any>): Observable<ProcessingEvent> => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total 
              ? Math.round(100 * event.loaded / event.total)
              : 0;
            return new Observable<ProcessingEvent>(observer => {
              observer.next({ 
                type: 'uploadProgress',
                data: progress 
              });
              observer.complete();
            });
          
          case HttpEventType.Response:
            const timestamp = event.body.timestamp;
            
            // Start polling for status
            const statusPolling = interval(1000).pipe(
              switchMap(() => this.getProcessingStatus(timestamp)),
              takeWhile(status => status.status !== 'completed' && status.status !== 'error', true),
              map(status => ({
                type: 'processingStatus' as const,
                data: status,
                timestamp
              }))
            );

            const completion = statusPolling.pipe(
              filter(event => event.data.status === 'completed'),
              switchMap(() => this.downloadVideo(timestamp)),
              map(response => ({
                type: 'complete' as const,
                data: response,
                timestamp
              }))
            );

            return merge(statusPolling, completion);
          
          default:
            return new Observable<ProcessingEvent>(observer => {
              observer.next({ type: 'uploadProgress', data: 0 });
              observer.complete();
            });
        }
      })
    );
  }

  getProcessingStatus(timestamp: string): Observable<ProcessingStatus> {
    return this.http.get<ProcessingStatus>(`${this.apiUrl}/processing-status/${timestamp}`);
  }
  processImages(files: File[]): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file, file.name);
    });
    return this.http.post<any>(`${this.apiUrl}/process-image`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    });
  }

  downloadVideo(timestamp: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/download/${timestamp}`);
  }
}
