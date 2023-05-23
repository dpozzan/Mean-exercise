import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthSub!: Subscription;
  userIsAuthenticated: boolean = false;


  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.isAuthSub = this.authService.getIsAuthenticatedListener().subscribe( isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    })
  }

  onLogout() {
    this.authService.handleLogout();
  }

  ngOnDestroy() {
    this.isAuthSub.unsubscribe();
  }

}
