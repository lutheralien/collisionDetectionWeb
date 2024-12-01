import { Component, Input, OnChanges } from '@angular/core';
import { NavItem } from './nav-item';
import { Router, RouterOutlet } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IconsModule } from '../../../../icons/icons.module';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  imports: [IconsModule, MatListModule, RouterOutlet, MatToolbarModule, CommonModule],
  styleUrls: ['./nav-item.component.scss'],
  standalone: true,
})
export class AppNavItemComponent implements OnChanges {
  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        // Implement additional logic if needed
      }
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }

    // Scroll to top
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
