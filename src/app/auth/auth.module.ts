import { NgModule } from "@angular/core";
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";

// You can remove AuthModule from AppModule because you don't need to put that there anymore, though you generate
// the module lazyly through AuthRoutingModule nested inside AppRoutingModule

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        AuthRoutingModule

    ]
})
export class AuthModule { }