import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {SkillEvaluationDetailsComponent} from '../skill-evaluation-details/skill-evaluation-details.component';
import {EditSkillEvaluationComponent} from '../edit-skill-evaluation/edit-skill-evaluation.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {SkillsEvalService} from '../services/skills-eval.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent implements OnInit {
  connectedUserRole: any;

  constructor(public dialog: MatDialog,
              private skillEvalService: SkillsEvalService) {
  }

  @Output() resultMsg = new EventEmitter<any>();
  @Input() userId: any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['select', 'category', 'name', 'status', 'level', 'action'];
  selection = new SelectionModel<any>(true, []);
  statusValues = ['All', 'Valid', 'Evaluated', 'Not Evaluated'];
  statusDefaultValue = 'All';
  skillsEvaluations: any;

  ngOnInit(): void {
    this.connectedUserRole = localStorage.getItem('role');
    console.log(this.connectedUserRole)
    this.loadData();
  }

  loadData(): void {
    this.skillsEvaluations = '';
    this.skillEvalService.getSkillEvaluationsByUser(this.userId).subscribe(results => {
      if (results) {
        this.skillsEvaluations = results;
        this.dataSource = new MatTableDataSource(this.skillsEvaluations);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'category':
              return item.Skill.Category.name;
            case 'name':
              return item.Skill.name;
            default:
              return item[property];
          }
        };
        this.dataSource.filterPredicate = (data: any, filterValue: string) => {
          return data.status.trim()
            .toLocaleLowerCase() === filterValue;
        };
      }
    });
  }

  openDetailsDialog(skillEvaluation: any): void {
    const dialogRef = this.dialog.open(SkillEvaluationDetailsComponent, {
      width: '600px',
      data: skillEvaluation,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditDialog(skillEvaluation: any): void {
    const dialogRef = this.dialog.open(EditSkillEvaluationComponent, {
      width: '600px',
      data: skillEvaluation,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resultMsg.emit(result);
        this.loadData();
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(): void {
    if (this.dataSource) {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }
      this.selection.select(...this.dataSource.data);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  /** validate selected skills evaluation */
  validateStatus(): void {
    if (this.selection.selected.length) {
      const skillsId = this.selection.selected.map(elt => elt.id);
      const data = {
        id: skillsId
      };
      this.skillEvalService.validateSkillEvaluations(data).subscribe(result => {
        this.resultMsg.emit(result);
        this.loadData();
      });
    } else {
      this.resultMsg.emit({warning: 'Please select a skill'});
    }
  }

  statusFilter($event: MatRadioChange): void {
    let filterValue = '';
    if ($event.value !== 'All') {
      filterValue = $event.value;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
