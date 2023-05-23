import { Component} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

//In this app we use ReactiveFormsModule for creating new post, and FormsModule(Template driven approach) for the login and signup


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
 

    constructor(public authService: AuthService) { }

    

    onLogin(form: NgForm) {
        this.authService.handleLogin(form.value)
    }

    

}