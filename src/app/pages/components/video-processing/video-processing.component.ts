import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../services/app.service';


interface ProcessingStatus {
  progress: number;
  frame_count: number;
  total_frames: number;
  status: 'starting' | 'processing' | 'completed' | 'error';
}

interface VideoResponse {
  status: string;
  message: string;
  timestamp: string;
  file_info: {
    filename: string;
    size: number;
    created: string;
  };
  video_data: string; // base64 string
}

@Component({
  selector: 'app-video-processing',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container mx-auto p-4">
    <!-- Video Selection -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Video Processing</h2>
      <div class="flex items-center gap-4">
        <input 
          type="file" 
          accept="video/*" 
          class="hidden" 
          #fileInput 
          (change)="onFileSelected($event)"
        >
        <button 
          (click)="fileInput.click()" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          [disabled]="isProcessing()"
        >
          Select Video
        </button>
        <span *ngIf="selectedFile()">
          Selected: {{selectedFile()?.name}}
        </span>
      </div>
    </div>

    <!-- Upload and Processing Progress -->
    <div *ngIf="isProcessing()" class="mb-8">
      <!-- Upload Progress -->
      <div *ngIf="uploadProgress() > 0" class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            [style.width]="uploadProgress() + '%'"
          ></div>
        </div>
        <div class="text-sm text-gray-600 mt-1">
          Upload Progress: {{uploadProgress()}}%
        </div>
      </div>

      <!-- Processing Progress -->
      <div *ngIf="processingStatus()" class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
            [style.width]="processingStatus()?.progress + '%'"
          ></div>
        </div>
        <div class="text-sm text-gray-600 mt-1">
          Processing Progress: {{processingStatus()?.progress?.toFixed(1)}}%
          <span *ngIf="processingStatus()?.frame_count">
            (Frame {{processingStatus()?.frame_count}} / {{processingStatus()?.total_frames}})
          </span>
        </div>
      </div>

      <!-- Processing Indicator -->
      <div class="flex items-center gap-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span>
          {{processingStatus()?.status === 'starting' ? 'Initializing...' : 
            processingStatus()?.status === 'processing' ? 'Processing video...' : 
            'Finalizing...'}}
        </span>
      </div>
    </div>

    <!-- File Info -->
    <div *ngIf="fileInfo()" class="mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Processed File Information</h3>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div>Filename:</div>
        <div>{{fileInfo()?.filename}}</div>
        <div>Size:</div>
        <div>{{formatFileSize(fileInfo()?.size)}}</div>
        <div>Created:</div>
        <div>{{formatDate(fileInfo()?.created)}}</div>
      </div>
    </div>

    <!-- Processed Video Display -->
    <div *ngIf="processedVideoUrl()" class="mb-8">
      <h3 class="text-xl font-bold mb-4">Processed Video</h3>
      <video 
        controls 
        class="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
        [src]="processedVideoUrl()"
      >
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Error Display -->
    <div *ngIf="error()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{error()}}</span>
    </div>
  </div>
`})
export class VideoProcessingComponent {
  private videoService = inject(AppService);

  // Signals for component state
  uploadProgress = signal<number>(0);
  selectedFile = signal<File | null>(null);
  isProcessing = signal<boolean>(false);
  processedVideoUrl = signal<string | null>(null);
  processingStatus = signal<ProcessingStatus | null>(null);
  fileInfo = signal<VideoResponse['file_info'] | null>(null);
  error = signal<string | null>(null);
  
  private statusCheckInterval: number | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile.set(input.files[0]);
      this.processVideo();
    }
  }

  private processVideo() {
    const file = this.selectedFile();
    if (!file) return;

    this.resetState();
    this.isProcessing.set(true);

    this.videoService.processVideo(file).subscribe({
      next: (event) => {
        if (event.type === 'uploadProgress') {
          this.uploadProgress.set(event.data as number);
        } else if (event.type === 'processingStatus') {
          this.processingStatus.set(event.data as ProcessingStatus);
          if (event.data.status === 'completed' && event.timestamp) {
            this.handleProcessingComplete(event.timestamp);
          }
        } else if (event.type === 'complete') {
          const response = event.data as VideoResponse;
          this.handleVideoResponse(response);
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private handleProcessingComplete(timestamp: string | undefined) {
    if (!timestamp) {
      this.handleError(new Error('No timestamp provided for video download'));
      return;
    }

    if (this.statusCheckInterval) {
      window.clearInterval(this.statusCheckInterval);
    }
    
    // Fetch the processed video
    this.videoService.downloadVideo(timestamp).subscribe({
      next: (response) => this.handleVideoResponse(response),
      error: (error) => this.handleError(error)
    });
  }

  private handleVideoResponse(response: VideoResponse) {
    this.fileInfo.set(response.file_info);
    this.processedVideoUrl.set(`data:video/mp4;base64,${response.video_data}`);
    this.isProcessing.set(false);
  }

  private handleError(error: any) {
    const errorMessage = error instanceof Error ? error.message : 
      error?.error?.message || 'Error processing video. Please try again.';
    this.error.set(errorMessage);
    this.isProcessing.set(false);
    this.uploadProgress.set(0);
    console.error('Video processing error:', error);
  }

  private resetState() {
    this.error.set(null);
    this.processedVideoUrl.set(null);
    this.processingStatus.set(null);
    this.fileInfo.set(null);
    this.uploadProgress.set(0);
    if (this.statusCheckInterval) {
      window.clearInterval(this.statusCheckInterval);
    }
  }

  public formatFileSize(bytes: number | undefined): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  }

  ngOnDestroy() {
    if (this.statusCheckInterval) {
      window.clearInterval(this.statusCheckInterval);
    }
    // Cleanup object URL if exists
    const url = this.processedVideoUrl();
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}