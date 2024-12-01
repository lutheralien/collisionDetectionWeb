import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../services/app.service';

interface ImageDetection {
  detections: {
    potential_collisions: number;
    total_vehicles: number;
  };
  file_info: {
    created: string;
    filename: string;
    size: number;
  };
  image_data: string;
  original_filename: string;
}

@Component({
  selector: 'app-image-processing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <input 
        type="file" 
        multiple 
        (change)="onFilesSelected($event)"
        class="block w-full text-sm text-gray-500 
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
      />

      @if (uploadProgress() > 0) {
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              class="bg-blue-600 h-2.5 rounded-full" 
              [style.width.%]="uploadProgress()"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-1">
            Processing: {{ uploadProgress() }}%
          </p>
        </div>
      }

      @if (processedImages().length) {
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (image of processedImages(); track image.original_filename) {
            <div class="bg-white rounded-lg shadow-md p-4">
              <img 
                [src]="'data:image/jpeg;base64,' + image.image_data" 
                [alt]="image.original_filename"
                class="w-full h-48 object-cover rounded-md mb-4"
              />
              <div class="text-sm">
                <p class="font-semibold">{{ image.original_filename }}</p>
                <p>Vehicles Detected: {{ image.detections.total_vehicles }}</p>
                <p>Potential Collisions: {{ image.detections.potential_collisions }}</p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class ImageProcessingComponent {
  // Signals for reactive state management
  uploadProgress = signal(0);
  processedImages = signal<ImageDetection[]>([]);

  constructor(private collisionService: AppService) {}

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files: File[] = input.files ? Array.from(input.files) : [];

    if (files.length) {
      this.collisionService.processImages(files).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress.set(
              Math.round(100 * event.loaded / (event.total || 1))
            );
          } else if (event.type === HttpEventType.Response) {
            const response = event.body as { images: ImageDetection[] };
            if (response.images) {
              this.processedImages.set(response.images);
            }
            this.uploadProgress.set(0);
          }
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.uploadProgress.set(0);
        }
      });
    }
  }
}