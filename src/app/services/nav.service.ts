import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState } from '../state/app.state'; // Adjust the import path as needed
import { navItems } from '../pages/dashboard/sidebar/sidebar-data';

@Injectable({ providedIn: 'root' })
export class NavService {
    public currentUrl = new BehaviorSubject<any>(undefined);
    private authorizedNavItems = new BehaviorSubject<any[]>([]);

    constructor(private router: Router, private appState: AppState) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.currentUrl.next(event.urlAfterRedirects);
            }
        });

        // Initialize authorized nav items
        this.updateAuthorizedNavItems();

        // Subscribe to changes in user permissions
        this.appState.getState$().subscribe(() => {
            this.updateAuthorizedNavItems();
        });
    }

    private updateAuthorizedNavItems() {
        const userPermissions = this.appState.getState().user?.permissions;
        const filteredItems = navItems.filter(item => 
            !item.permission || userPermissions?.includes(item.permission)
        );
        this.authorizedNavItems.next(filteredItems);
    }

    getAuthorizedNavItems(): Observable<any[]> {
        return this.authorizedNavItems.asObservable();
    }
}