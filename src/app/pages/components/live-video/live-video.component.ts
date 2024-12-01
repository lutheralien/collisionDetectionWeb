import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Socket } from 'ngx-socket-io';

interface StreamMetadata {
  detections: number;
  collisions: number;
  timestamp: string;
}

@Component({
  selector: 'app-live-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Live Video Feed</h2>
        
        <!-- Connection Status -->
        <div class="mb-4">
          <span 
            [ngClass]="[
              'px-2 py-1 rounded text-sm',
              isConnected() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]"
          >
            {{ isConnected() ? 'Connected' : 'Disconnected' }}
          </span>
        </div>
        
        <!-- Stream Controls -->
        <div class="flex gap-4 mb-4">
          <button 
            (click)="toggleStream()" 
            [disabled]="!isConnected()"
            [ngClass]="[
              'px-4 py-2 rounded transition text-white',
              !isConnected() ? 'bg-gray-400 cursor-not-allowed' :
              isStreaming() ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            ]"
          >
            {{ isStreaming() ? 'Stop Stream' : 'Start Stream' }}
          </button>
        </div>

        <!-- Live Feed Display -->
        <div class="relative aspect-video max-w-3xl mx-auto bg-black rounded-lg overflow-hidden">
          <!-- Video Canvas -->
          <img 
            *ngIf="currentFrame()"
            [src]="'data:image/jpeg;base64,' + currentFrame()"
            class="w-full h-full object-contain"
            alt="Live video feed"
          />

          <!-- Overlay with Stats -->
          <div 
            *ngIf="metadata()"
            class="absolute top-0 left-0 p-4 bg-black bg-opacity-50 text-white rounded-br"
          >
            <div>Detections: {{metadata()?.detections}}</div>
            <div>Collisions: {{metadata()?.collisions}}</div>
            <div class="text-xs">{{formatTimestamp(metadata()?.timestamp)}}</div>
          </div>

          <!-- Loading State -->
          <div 
            *ngIf="isStreaming() && !currentFrame()"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          
          <!-- Disconnected State -->
          <div 
            *ngIf="!isConnected()"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white"
          >
            <span>Disconnected from server</span>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div 
        *ngIf="error()" 
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
      >
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{error()}}</span>
        <button 
          class="absolute top-0 right-0 px-4 py-3"
          (click)="error.set(null)"
        >
          <span class="sr-only">Dismiss</span>
          <span class="text-red-500">×</span>
        </button>
      </div>
    </div>
  `
})
export class LiveVideoComponent implements OnInit, OnDestroy {
  private socket = inject(Socket);

  // Signals
  isConnected = signal<boolean>(false);
  isStreaming = signal<boolean>(false);
  currentFrame = signal<string | null>(null);
  metadata = signal<StreamMetadata | null>(null);
  error = signal<string | null>(null);

  ngOnInit() {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    console.log('Setting up socket listeners...');
    
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.isConnected.set(true);
      this.error.set(null);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.isConnected.set(false);
      this.isStreaming.set(false);
      this.currentFrame.set(null);
      this.metadata.set(null);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      this.error.set(`Connection error: ${error.message}`);
      this.isConnected.set(false);
    });

    // Stream events
    this.socket.on('video_frame', (data: { 
      frame: string,
      detections: number,
      collisions: number,
      timestamp: string 
    }) => {
      this.currentFrame.set(data.frame);
      this.metadata.set({
        detections: data.detections,
        collisions: data.collisions,
        timestamp: data.timestamp
      });
    });

    this.socket.on('stream_error', (data: { error: string }) => {
      console.error('Stream error:', data.error);
      this.error.set(data.error);
      this.isStreaming.set(false);
    });

    this.socket.on('stream_status', (data: { status: string }) => {
      console.log('Stream status:', data.status);
      this.isStreaming.set(data.status === 'started');
      if (data.status === 'stopped') {
        this.currentFrame.set(null);
        this.metadata.set(null);
      }
    });
  }

  toggleStream() {
    if (!this.isConnected()) return;
    
    if (this.isStreaming()) {
      console.log('Stopping stream...');
      this.socket.emit('stop_stream');
    } else {
      console.log('Starting stream...');
      this.socket.emit('start_stream');
      this.error.set(null);
    }
  }

  formatTimestamp(timestamp: string | undefined): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  }

  ngOnDestroy() {
    console.log('Component destroying...');
    if (this.isStreaming()) {
      this.socket.emit('stop_stream');
    }
    this.socket.removeAllListeners();
  }
}