import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Environment } from '@mockoon/commons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentLog } from 'src/renderer/app/models/environment-logs.model';
import { EnvironmentsService } from 'src/renderer/app/services/environments.service';
import {
  EnvironmentStatus,
  Store,
  ViewsNameType
} from 'src/renderer/app/stores/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  public activeEnvironment$: Observable<Environment>;
  public activeView$: Observable<ViewsNameType>;
  public activeEnvironmentState$: Observable<EnvironmentStatus>;
  public environmentLogs$: Observable<EnvironmentLog[]>;
  public tabs: {
    id: ViewsNameType;
    title: string;
    icon: string;
    count?: Observable<number>;
  }[];

  constructor(
    private store: Store,
    private environmentsService: EnvironmentsService
  ) {}

  ngOnInit() {
    this.activeView$ = this.store.select('activeView');
    this.activeEnvironment$ = this.store.selectActiveEnvironment();
    this.activeEnvironmentState$ = this.store.selectActiveEnvironmentStatus();
    this.environmentLogs$ = this.store.selectActiveEnvironmentLogs();

    this.tabs = [
      {
        id: 'ENV_ROUTES',
        title: 'Routes',
        icon: 'settings_input_component',
        count: this.activeEnvironment$.pipe(
          map((environment) => environment.routes.length)
        )
      },
      {
        id: 'ENV_HEADERS',
        title: 'Headers',
        icon: 'featured_play_list',
        count: this.activeEnvironment$.pipe(
          map((environment) => environment.headers.length)
        )
      },
      {
        id: 'ENV_LOGS',
        title: 'Logs',
        icon: 'history',
        count: this.environmentLogs$.pipe(
          map((environmentLogs) => environmentLogs.length)
        )
      },
      { id: 'ENV_PROXY', title: 'Proxy', icon: 'security' },
      { id: 'ENV_SETTINGS', title: 'Settings', icon: 'settings' }
    ];
  }

  /**
   * Set the application active view (routes / logs / settings)
   */
  public setActiveView(viewName: ViewsNameType) {
    this.environmentsService.setActiveView(viewName);
  }

  /**
   * Toggle active environment running state (start/stop)
   */
  public toggleEnvironment() {
    this.environmentsService.toggleActiveEnvironment();
  }
}
