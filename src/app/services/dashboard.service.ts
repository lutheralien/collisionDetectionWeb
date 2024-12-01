// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { baseurl } from '../constants/baseurl.contants';

// Add these interfaces to your component file
interface Reviewer {
  id: string;
  name: string;
  email: string;
  count: number;
}

interface Uploader {
  id: string,
  name: string,     
  email: string,    
  count: number
}

interface Contributors {
  totalUploaders: number;
  topUploaders: Uploader[];
  mostActiveReviewers: Reviewer[];
}

export interface QuestionMetrics {
  total: {
    questions: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  timeline: {
    byYear: Record<string, number>;
    byMonth: Record<string, number>;
  };
  review: {
    averageReviewTime: number;
    reviewedLastWeek: number;
    reviewedLastMonth: number;
    pendingAge: {
      lessThan24h: number;
      lessThan72h: number;
      moreThan72h: number;
    };
  };
  distribution: {
    byProgram: Record<string, number>;
    byCourse: Record<string, number>;
    byExamination: Record<string, number>;
    bySemester: Record<string, number>;
  };
  contributors: Contributors;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  private metricsSubject = new BehaviorSubject<QuestionMetrics | null>(null);

  constructor(private http: HttpClient) {}

  fetchMetrics(): Observable<any> {
    return this.http.get<any>(`${baseurl}/question/metrics`).pipe(
      tap(response => this.metricsSubject.next(response.data))
    );
  }

  getMetrics(): Observable<QuestionMetrics | null> {
    return this.metricsSubject.asObservable();
  }
}
