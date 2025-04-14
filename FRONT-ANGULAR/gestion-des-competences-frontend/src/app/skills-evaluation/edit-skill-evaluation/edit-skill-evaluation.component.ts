import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {SkillsEvalService} from '../services/skills-eval.service';

@Component({
  selector: 'app-edit-skill-evaluation',
  templateUrl: './edit-skill-evaluation.component.html',
  styleUrls: ['./edit-skill-evaluation.component.scss']
})
export class EditSkillEvaluationComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  msgs: any;
  currentRate = 0;
  status: string[] = ['Not Evaluated', 'Evaluated', 'Valid' ];
  maxStar = 4;

  constructor(private fb: FormBuilder, private router: Router,
              public dialogRef: MatDialogRef<EditSkillEvaluationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private skillEvalService: SkillsEvalService,
              config: NgbRatingConfig) {
    config.max = 4;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      evaluationEvidence: [this.data.evaluationEvidence],
      status: [this.data.status],
    });
    this.currentRate = this.data.level;
  }

  onRate($event: number): void {
    this.currentRate = $event;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newSkillEval = {
        id: this.data.id,
        level: this.currentRate,
        evaluationEvidence: this.form.value.evaluationEvidence,
        status: this.form.value.status,
      };
      this.skillEvalService.updateSkillEval(newSkillEval).subscribe(result => {
        if (result) {
          this.closeDialog(result);
        }
      });
    } else {
      this.validateOnSubmit(this.form);
      this.msgs = [{severity: 'error', summary: 'Error', detail: 'All fields are required'}];
    }
  }

  cancel(): void {
    this.ngOnInit();
  }

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }

  validateOnSubmit(form: any): void {
    Object.keys(form.controls).map(x => form.controls[x].markAsTouched({onlySelf: true}));
  }
}
