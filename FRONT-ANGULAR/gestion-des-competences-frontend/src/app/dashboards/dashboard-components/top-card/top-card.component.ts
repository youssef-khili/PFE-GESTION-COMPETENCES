import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DepartmentService} from '../../../departments/services/department.service';
import {SkillService} from '../../../skills-dashboard/services/skill.service';
import {UserService} from '../../../users/services/user.service';
import {ChartService} from "../../services/chart.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatOption} from "@angular/material/core";

@Component({
  selector: 'app-top-card',
  templateUrl: './top-card.component.html',
  styleUrls: ['./top-card.component.scss']
})
export class TopCardComponent implements OnInit {
  connectedUserRole: any;
  departments: any;
  selectedDepartment: any;
  users: any;
  selectedUsers: any;
  skills: any;
  selectedSkills: FormGroup | undefined;
  @ViewChild('allSelected') private allSelected: MatOption | undefined;
  @Output() resultData = new EventEmitter<any>();

  constructor(private departmentService: DepartmentService,
              private skillService: SkillService,
              private chartService: ChartService,
              private fb: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.connectedUserRole = localStorage.getItem('role');
    this.selectedSkills = this.fb.group({
      skills: new FormControl('')
    });
    this.departmentService.getDepartments().subscribe(results => {
      if (results) {
        this.departments = results;
      }
    });
    this.userService.getUsersFullnames().subscribe(results => {
      if (results) {
        this.users = results;
      }
    });
    this.skillService.getSkills().subscribe(results => {
      if (results) {
        this.skills = results;
      }
    });
  }

  applyFilter(): any {
    let skills = '';
    let department = '';
    let user = '';

    if (this.selectedSkills?.controls.skills) {
      skills = this.transformArrayToString(this.selectedSkills.controls.skills.value);
    }
    if (this.selectedDepartment) {
      department = this.selectedDepartment;
    }
    if (this.selectedUsers) {
      user = this.selectedUsers;
    }
    this.chartService.applyFilter(skills, user, department).subscribe((results: any) => {
      if (results) {
        this.resultData.emit(results);
      }
    });
  }

  transformArrayToString(array: any): any {
    return array.toString();
  }


  tosslePerOne(all: any): any {
    if (this.allSelected && this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }

    if (this.allSelected && this.selectedSkills &&
      this.selectedSkills.controls.skills.value.length === this.skills.length) {
      this.allSelected.select();
    }

  }

  toggleAllSelection(): any {
    if (this.allSelected && this.selectedSkills && this.allSelected.selected) {
      this.selectedSkills.controls.skills
        .patchValue([...this.skills.map((item: any) => item.id), 0]);
    } else {
      // @ts-ignore
      this.selectedSkills.controls.skills.patchValue([]);
    }
  }
}
