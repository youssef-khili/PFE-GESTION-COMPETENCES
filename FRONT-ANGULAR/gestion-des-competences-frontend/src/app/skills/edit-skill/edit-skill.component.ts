import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SkillService} from "../services/skill.service";
import {CategoryServiceService} from "../../category/service/category-service.service";
import {Skill} from "../models/Skill";

@Component({
  selector: 'app-edit-skill',
  templateUrl: './edit-skill.component.html',
  styleUrls: ['./edit-skill.component.scss']
})
export class EditSkillComponent implements OnInit {
  @Output() displayDialog = new EventEmitter<boolean>();


  public form: FormGroup = Object.create(null);
  public categories: any;
  public msgs: any;


  constructor(private fb: FormBuilder, private skillService: SkillService,
              private categoryService: CategoryServiceService,  public dialogRef: MatDialogRef<EditSkillComponent>,
              @Inject(MAT_DIALOG_DATA) public skill: Skill) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.skill.name, Validators.compose([Validators.required])],
      category: [this.skill.Category, Validators.compose([Validators.required])],
    });
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  validateOnSubmit(form: any): void {
    Object.keys(form.controls).map(x => form.controls[x].markAsTouched({ onlySelf: true }));
  }
  onSubmit(): void {
    if (this.form.valid) {
      const skillEdited = {
        id: this.skill.id,
        name:this.form.value.name,
        CategoryId: this.form.value.category.id,
      };
      this.skillService.updateSkill(skillEdited).subscribe(data => {
        this.closeDialog(data.message);
      }, err => {
        this.msgs = [{severity: 'error', summary: 'Error', detail: err}];
      });
    }else {
      this.validateOnSubmit(this.form);
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'All fields are required'}];
    }
  }
  close(): void {
    this.displayDialog.emit(false);
  }
  resetForm(): void{
    this.ngOnInit();
  }
  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

}
