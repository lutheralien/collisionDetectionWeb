
// dashboard.component.ts
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardStateService, QuestionMetrics } from '../../../services/dashboard.service';


@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    BaseChartDirective
  ],
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private destroy$ = new Subject<void>();
  metrics: QuestionMetrics | null = null;

  // Distribution Chart
  public distributionChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  
  public distributionChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0'
      ]
    }]
  };
  
  // Timeline Chart
  public timelineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
      }
    }
  };
  
  public timelineChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Questions per Month',
        backgroundColor: '#36A2EB'
      }
    ]
  };

  constructor(
    private dashboardService: DashboardStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dashboardService.fetchMetrics().pipe(takeUntil(this.destroy$)).subscribe();
    
    this.dashboardService.getMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        if (metrics) {
          this.metrics = metrics;
          this.updateCharts();
        }
      });
  }

  ngAfterViewInit() {
    if (this.metrics) {
      this.updateCharts();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateCharts() {
    if (this.metrics) {
      // Update Distribution Chart
      this.updateDistributionChart();
      // Update Timeline Chart
      this.updateTimelineChart();
      this.cdr.detectChanges();
    }
  }

  updateDistributionChart() {
    const programData = Object.entries(this.metrics!.distribution.byProgram);
    this.distributionChartData.labels = programData.map(([name]) => name);
    this.distributionChartData.datasets[0].data = programData.map(([, count]) => count);
  }

  updateTimelineChart() {
    const monthlyData = Object.entries(this.metrics!.timeline.byMonth);
    this.timelineChartData.labels = monthlyData.map(([month]) => month);
    this.timelineChartData.datasets[0].data = monthlyData.map(([, count]) => count);
  }
}