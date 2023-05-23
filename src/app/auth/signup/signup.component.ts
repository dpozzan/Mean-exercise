import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

//In this app we use ReactiveFormsModule for creating new post, and FormsModule(Template driven approach) for the login and signup


@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

    constructor(public authService: AuthService) {

    }

    onSignup(form: NgForm) {
        this.authService.handleSignup(form.value)
    }

}