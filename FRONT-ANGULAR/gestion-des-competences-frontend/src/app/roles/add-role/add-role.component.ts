import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RoleService} from '../service/role.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  public msgs: any;

  constructor(private fb: FormBuilder, private roleService: RoleService,
              private router: Router, public dialogRef: MatDialogRef<AddRoleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }


  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      description: [null],
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
    const newRole = {
      name: this.form.value.name.toUpperCase(),
      description: this.form.value.description,
    };
    this.roleService.createRole(newRole).subscribe(data => {
      this.closeDialog(data.success);
    }, er => {
      this.msgs = [{severity: 'error', summary: 'Error', detail: er}];

    });
    }else {
      this.validateOnSubmit(this.form);
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'All fields are required'}];
    }
  }
  cancel(): void{
    this.ngOnInit();
  }
  validateOnSubmit(form: any): void {
    Object.keys(form.controls).map(x => form.controls[x].markAsTouched({ onlySelf: true }));
  }

}
