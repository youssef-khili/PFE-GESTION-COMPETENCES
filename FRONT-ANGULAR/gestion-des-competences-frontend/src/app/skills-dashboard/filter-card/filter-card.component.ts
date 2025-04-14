import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SkillService} from "../services/skill.service";
import {UserService} from "../../users/services/user.service";
import {DepartmentService} from "../../departments/services/department.service";
import {DashboardService} from "../services/dashboard.service";
import {MatOption} from "@angular/material/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.scss']
})
export class FilterCardComponent implements OnInit {
  skills: any;
  connectedUserRole: any;
  departments: any;
  levels = [
    {
      id: 0,
      value: '0'
    }, {
      id: 1,
      value: '1'
    }, {
      id: 2,
      value: '2'
    }, {
      id: 3,
      value: '3'
    }, {
      id: 4,
      value: '4'
    },
  ];
  users: any;
  selectedSkills: FormGroup | undefined;
  selectedDepartments: any;
  selectedUsers: any;
  minLevel: any;
  @ViewChild('allSelected') private allSelected: MatOption | undefined;
  @Output() resultData = new EventEmitter<any>();

  constructor(private skillService: SkillService,
              private userService: UserService,
              private departmentService: DepartmentService,
              private dashboardService: DashboardService,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.connectedUserRole = localStorage.getItem('role');
    this.selectedSkills = this.fb.group({
      skills: new FormControl('')
    });
    this.skillService.getSkills().subscribe(results => {
      this.skills = results;
    });
    this.departmentService.getDepartments().subscribe(results => {
      this.departments = results;
    });
    this.userService.getUsersFullnames().subscribe(results => {
      this.users = results;
    });
  }

  applyFilter(): any {
    let skills = '';
    let departments = '';
    let users = '';
    if (this.selectedSkills?.controls.skills) {
      skills = this.transformArray(this.selectedSkills.controls.skills.value);
    }

    if (this.selectedDepartments) {
      departments = this.transformArray(this.selectedDepartments);
    }
    if (this.selectedUsers) {
      users = this.transformArray(this.selectedUsers);
    }
    this.dashboardService.applyFilter(skills, this.minLevel, users, departments).subscribe((results: any) => {
      if (results) {
        this.resultData.emit({results, skills});
      }
    });
  }

  transformArray(array: any): any {
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
