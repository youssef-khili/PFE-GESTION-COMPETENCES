import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, PrimeNGConfig} from 'primeng-lts/api';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SkillService} from '../services/skill.service';
import {DashboardService} from '../services/dashboard.service';
import {DepartmentService} from '../../departments/services/department.service';
import {UserService} from '../../users/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ConfirmationService]
})
export class DashboardComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig,
              private skillService: SkillService,
              private userService: UserService,
              private departmentService: DepartmentService,
              private dashboardService: DashboardService,
              public dialog: MatDialog
  ) {
  }

  users: any;
  skillsColumns = [];
  displayedColumns: string[] = ['user'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  ngOnInit(): void {
    this.loadData();
    this.primengConfig.ripple = true;
  }

  loadData(): void {
    this.skillService.getSkillsNames().subscribe(results => {
      this.skillsColumns = Array.from(new Set(results));
      this.displayedColumns = ['user', ...this.skillsColumns];
      console.log(this.skillsColumns);
      console.log(this.displayedColumns);
    });
    this.dashboardService.getDashboardEvaluation().subscribe((results: any) => {
      if (results) {
        this.initializeTableDataSource(results);
      }
    });

  }

  applyFilter($event: any): void {
    if ($event.skills) {
      this.skillService.getSkillsByIds($event.skills).subscribe((results: any) => {
        if (results) {
          this.displayedColumns = ['user'].concat(results);
        }
      });
    }
    this.initializeTableDataSource($event.results);
  }
  initializeTableDataSource(data: any): void {
    const transformedData = data.map((row: any) => {
      const transformedRow: { [key: string]: any } = {
        user: row.user,
        userId: row.userId,
      };
      this.skillsColumns.forEach((col: string) => {
        transformedRow[col] = row[col]
          ? { level: row[col], status: 'Evaluated' }
          : { level: 0, status: 'Not Evaluated' };
      });

      return transformedRow;
    });

    console.log('Transformed Data:', transformedData);

    this.dataSource = new MatTableDataSource(transformedData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
