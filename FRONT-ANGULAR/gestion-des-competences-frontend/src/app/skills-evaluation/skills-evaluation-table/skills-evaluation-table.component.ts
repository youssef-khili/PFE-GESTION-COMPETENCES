import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SkillsEvalService} from '../services/skills-eval.service';

@Component({
  selector: 'app-skills-evaluation-table',
  templateUrl: './skills-evaluation-table.component.html',
  styleUrls: ['./skills-evaluation-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class SkillsEvaluationTableComponent implements OnInit {
  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['firstName', 'department', 'function'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any ;
  displayedColumns: string[] = ['category', 'name', 'status', 'rate', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  msgs: any;
  connectedUserRole: any;

  constructor(public dialog: MatDialog, private skillEvalService: SkillsEvalService) {
  }

  ngOnInit(): void {
    this.connectedUserRole = localStorage.getItem('role');
    this.loadData();
  }


  loadData(): void {
    this.skillEvalService.getUsersWithSkillEval().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'department':
            return item.Department.name;
          case 'function':
            return item.Function.name;
          default:
            return item[property];
        }
      };
    });
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  displayMsg($event: any): void {
    if ($event.message) {
      this.msgs = [{severity: 'success', summary: 'Confirmed', detail: $event.message}];
    }else {
      if ($event.warning){
        this.msgs = [{severity: 'warn', summary: 'Warning', detail: $event.warning}];
      }
    }
  }
}

