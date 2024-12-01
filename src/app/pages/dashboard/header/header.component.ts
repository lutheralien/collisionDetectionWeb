import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { IconsModule } from '../../../icons/icons.module';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { AppState } from '../../../state/app.state';
import { RoleControlDirective } from '../../../directives/role-control.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatFabButton,
    MatMenu,
    RouterLink,
    IconsModule,
    MatIcon,
    MatMenuTrigger,
    MatToolbar,
    MatButtonModule,
    MatMenuModule,
    RoleControlDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  @ViewChild('profilemenu') profilemenu!: MatMenu;

  showFiller = false;

  constructor(public dialog: MatDialog, private $state: AppState) {}

  logout() {
    this.$state.logout()
  }
}