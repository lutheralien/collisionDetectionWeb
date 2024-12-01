import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavService } from '../../../services/nav.service';
import { BrandingComponent } from './branding.component';
import { AppNavItemComponent } from './nav-item/nav-item.component';
import { MatNavList } from '@angular/material/list';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, AppNavItemComponent, MatNavList],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  navItems: any[] = [];
  private subscription: Subscription = Subscription.EMPTY;

  constructor(public navService: NavService) {}

  ngOnInit(): void {
    this.subscription = this.navService.getAuthorizedNavItems().subscribe(
      items => this.navItems = items
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}