import { NgModule } from '@angular/core';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router'; //you need to import that to enable Routes
import { CommonModule } from '@angular/common'; //you need to import that to enable ngIf

@NgModule({
    declarations: [
        CreatePostComponent,
        PostsListComponent
    ],
    imports: [
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
        CommonModule
    ]
})
export class PostModule { }