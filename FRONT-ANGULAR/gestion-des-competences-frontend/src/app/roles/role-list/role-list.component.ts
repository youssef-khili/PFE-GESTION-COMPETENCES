import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, PrimeNGConfig} from "primeng-lts/api";
import {User} from "../../users/models/User";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {RoleService} from "../service/role.service";
import {MatDialog} from "@angular/material/dialog";
import {AddRoleComponent} from "../add-role/add-role.component";
import {EditRoleComponent} from "../edit-role/edit-role.component";
import {Role} from "../models/Role";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  providers: [ConfirmationService]

})
export class RoleListComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig,
              private confirmationService: ConfirmationService,
              private roleService: RoleService,
              public dialog: MatDialog
  ) {
  }

  roles: any;
  totalRecords = 0;
  displayEditDialog = false;
  statuses: any;
  loading = true;
  msgs: any;
  fileName = '';
  fileTypes: string[] = ['.csv', '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'];
  displayedColumns: string[] = ['name', 'description', 'action'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  openAddRoleDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.loadData();
      this.msgs = [{severity: 'success', summary: 'Confirmed', detail: result}];
      }
    });
  }

  openEditRoleDialog(role: Role): void {
    const dialogRef = this.dialog.open(EditRoleComponent, {
      width: '500px',
      data: role,
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
      this.loadData();
      this.msgs = [{severity: 'success', summary: 'Confirmed', detail: result}];
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.primengConfig.ripple = true;
  }

  deleteRole(id: any): void {
    this.roleService.deleteRole(id).subscribe(result => {
      this.msgs = [{severity: 'success', summary: 'Confirmed', detail: 'Role deleted'}];
      this.loadData();
    }, () => {
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'Please try again !'}];

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
      }); } else {
        this.msgs = [{severity: 'error', summary: 'Error', detail: 'Only excel file accepted'}];
      }
    }
  }

  loadData(): void {
    this.roleService.getRoles().subscribe(roles => {
      this.roles = roles;
      this.totalRecords = roles.length;
      this.dataSource = new MatTableDataSource(this.roles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, () => {
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'Please refresh this page !'}];

    });
  }

  confirmDelete(roleId: string): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this role?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: 'pi',
      rejectIcon: 'pi',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteRole(roleId);
      },
      key: 'confirmDialog'
    });
  }



  uploadFile(file: any): void {
    this.roleService.uploadRoles(file).toPromise().then(data => {
      this.msgs = [{severity: 'success', summary: 'Success', detail: data.message}];
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, (error) => {
      console.log(error);
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'Please refresh this page !'}];

    });
  }


}
