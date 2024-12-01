import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IState } from '../models/state.model';

export interface IDocument {
  name: string;
  data: string;
  type: string;
  _id?: string;
}

@Injectable({ providedIn: 'root' })
export class AppState {
  private state$ = new BehaviorSubject<IState>({
    loading: false,
    user: [],
    programs: [],
    courses: [],
    examinations: [],
    questions: [],
    question: [],
    admins: [],
    plans: [],
    admin: [],
    transactions: [],
    transaction: [],
    orders: [],
    order: [],
    customers: [],
    customer: [],
    adminPermissions: [],
    token: '',
    refreshToken: '',
    roles: [],
    permissions: [],
    documents: [],
    isAuthenticated: false,
  });

  constructor(private router: Router) { }

  getState$(): Observable<IState> {
    return this.state$;
  }

  getState(): IState {
    return this.state$.getValue();
  }

  setState(data: Partial<IState>): void {
    const state = this.state$.getValue();
    this.state$.next(Object.assign(state, data));
  }

  logout(): void {
    this.setState({
      token: '',
      refreshToken: '',
      isAuthenticated: false,
      user: null
    });
    sessionStorage.removeItem('prep-archive-user-info');
    this.router.navigate(['../auth/login']);
  }

  unwind(data: any, value?: any, value2?: string): any {
    let count: number | undefined = undefined;
    let _data: Array<any> = [];
    if (Array.isArray(data)) {
      data.forEach((d: any) => {
        if (typeof d === 'object') {
          if (d[value] && Array.isArray(d[value])) {
            (d[value] as any as any[]).forEach((v) => {
              if (value2 && typeof value2 === 'string') {
                if (Array.isArray(v[value2])) {
                  _data = v[value2];
                } else {
                  count = v[value2];
                }
              } else {
                count = v.count;
              }
            });
          } else {
            if (d['_id'] === value) {
              count = d['count'];
            }
          }
        } else {
          if (
            (value && typeof value === 'string') ||
            typeof value === 'boolean'
          ) {
            if (d['_id'] === value) {
              count = d['count'];
            }
          } else {
            count = d['count'];
          }
        }
      });
    }
    return count || _data;
  }

  uploadFile(fullpath: boolean = false): Promise<string | IDocument> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = false;
      input.onchange = (e) => {
        try {
          const files = (e.target as any)?.files as FileList;
          const file = files[0];
          const fileReader = new FileReader();
          fileReader.onloadend = (f: any) => {
            const data = f.target.result;
            if (
              fullpath &&
              typeof fullpath === 'boolean' &&
              fullpath === true
            ) {
              resolve({
                type: file.type,
                name: file.name,
                data,
              });
            } else {
              resolve(data);
            }
          };
          fileReader.readAsDataURL(file);
        } catch (err) {
          console.log('err', err);

          reject(err);
        }
      };
      input.click();
      input.value = '';
    });
  }
}
