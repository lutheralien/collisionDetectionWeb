import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AppState } from '../state/app.state';

@Directive({
  selector: '[roleControl]',
  standalone: true
})
export class RoleControlDirective implements OnInit {
  @Input() roleControl: string | string[] = '';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private appState: AppState
  ) {}

  ngOnInit() {
    const permissions = this.appState.getState().user.permissions;
    const requiredPermissions = Array.isArray(this.roleControl) ? this.roleControl : [this.roleControl];

    if (requiredPermissions.some(permission => permissions.includes(permission))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}