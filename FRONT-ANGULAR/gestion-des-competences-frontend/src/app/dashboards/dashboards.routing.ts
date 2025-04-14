import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import {AuthGuard} from '../authentication/guards/auth.guard';
import {RoleGuard} from '../authentication/guards/role.guard';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Dashboard1Component,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Reporting ',
          expectedRoles: ['ADMIN', 'DIRECTOR', 'MANAGER']

        }
      }
    ]
  }
];
