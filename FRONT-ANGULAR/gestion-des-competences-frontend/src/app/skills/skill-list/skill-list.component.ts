import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, PrimeNGConfig} from "primeng-lts/api";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../users/models/User";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SkillService} from "../services/skill.service";
import {Skill} from "../models/Skill";
import {EditSkillComponent} from "../edit-skill/edit-skill.component";
import {AddSkillComponent} from "../add-skill/add-skill.component";

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss'],
  providers: [ConfirmationService]
})
export class SkillListComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig,
              private confirmationService: ConfirmationService,
              private skillService: SkillService,
              public dialog: MatDialog) { }
  skills: any;
  totalRecords = 0;
  statuses: any;
  loading = true;
  msgs: any;
  fileName = '';
  fileTypes: string[] = ['.csv', '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'];  displayedColumns: string[] = ['name','categoryName','action'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  openAddSkillDialog(): void {
    const dialogRef = this.dialog.open(AddSkillComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){this.loadData();
        this.msgs = [{severity: 'success', summary: 'Confirmed', detail: result}];

      }
    });
  }
  openEditSkillDialog(skill: Skill): void {
    const dialogRef = this.dialog.open(EditSkillComponent, {
      width: '500px',
      data: skill,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result){
        this.loadData();
        this.msgs = [{severity: 'success', summary: 'Confirmed', detail: result}];

      }

    });
  }
  ngOnInit(): void {
      this.loadData();
      this.primengConfig.ripple = true;
    }
  deleteSkill(id: any): void {
    this.skillService.deleteSkill(id).subscribe(result => {
      this.msgs = [{severity: 'success', summary: 'Confirmed', detail: 'Skill deleted'}];
      this.loadData();
    }, () => {
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'Please try again !'}];
    });
  }
  loadData(): void {
    this.skillService.getSkills().subscribe(skills => {
      this.skills = skills;
      this.totalRecords = skills.length;
      this.dataSource = new MatTableDataSource(this.skills);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, () => {
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'Please refresh this page !'}];

    });
  }
  confirmDelete(skillId: string): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this skill?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: 'pi',
      rejectIcon: 'pi',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteSkill(skillId);
      },
      key: 'confirmDialog'
    });
  }
  confirmUploadFile($event: any): void {
    this.fileName = '';
    const file = $event.target.files[0];
    if (file) {
      if (this.fileTypes.includes(file.type)) {
        this.fileName = file.name;
        this.confirmationService.confirm({
          message: 'Do you want to upload this file ' + this.fileName,
          header: 'Upload file Confirmation',
          icon: 'pi pi-info-circle',
          acceptIcon: 'pi',
          rejectIcon: 'pi',
          rejectButtonStyleClass: 'p-button-secondary',
          accept: () => {
            this.uploadFile(file);
            this.fileName = '';
          },
          reject: () => {
            this.fileName = '';
          },
          key: 'confirmDialog'
        });
      } else {
        this.msgs = [{severity: 'error', summary: 'Error', detail: 'Only excel file accepted'}];
      }
    }
  }

  uploadFile(file: any): void {
    this.skillService.uploadSkillls(file).toPromise().then(data => {
      this.msgs = [{severity: 'success', summary: 'Success', detail: data.message}];
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }

}
