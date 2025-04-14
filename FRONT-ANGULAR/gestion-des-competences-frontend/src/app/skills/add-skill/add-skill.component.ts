import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SkillService} from "../services/skill.service";
import {CategoryServiceService} from "../../category/service/category-service.service";

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})
export class AddSkillComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  public msgs: any;
  public categories: any;

  constructor(private fb: FormBuilder, private skillService: SkillService,
              private categoryService: CategoryServiceService,
              private router: Router, public dialogRef: MatDialogRef<AddSkillComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      category: [null, Validators.compose([Validators.required])],
    });
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
      const newSkill = {
        name: this.form.value.name,
        CategoryId: this.form.value.category.id,
      };
      this.skillService.createSkill(newSkill).subscribe(data => {
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
