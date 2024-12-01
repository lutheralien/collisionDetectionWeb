import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
      <a href="/">
        <img
          src="./assets/images/logos/preparchiveLogo.png"
          class="align-middle m-2 circular-image"
          alt="logo"
        />
      </a>
    </div>
  `,
  styles: [`
    .branding {
      display: flex;
      align-items: center;
    }

    .circular-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      display: inline-block;
    }
  `],
  standalone: true,
  imports: []
})
export class BrandingComponent {
  constructor() {}
}