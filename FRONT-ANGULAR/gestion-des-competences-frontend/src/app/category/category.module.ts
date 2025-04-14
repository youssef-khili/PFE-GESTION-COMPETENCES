import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import {MessagesModule} from "primeng-lts/messages";
import {DemoMaterialModule} from "../demo-material-module";
import {ToolbarModule} from "primeng-lts/toolbar";
import {ConfirmDialogModule} from "primeng-lts/confirmdialog";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [CategoryListComponent, AddCategoryComponent, EditCategoryComponent],
  exports: [
    CategoryListComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MessagesModule,
    DemoMaterialModule,
    ToolbarModule,
    ConfirmDialogModule,
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
