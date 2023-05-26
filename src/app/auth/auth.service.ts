import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + 'auth/'

@Injectable({providedIn: 'root'})
export class AuthService {
    private token: string | null = null;
    private expirationDate!: Date;
    private logoutTimer!: NodeJS.Timer;
    public isLoading: boolean = false;
    private isAuthenticated = new Subject<boolean>();
    private isAuth: boolean = false;
    private userId: string | null = null;


    constructor(private http: HttpClient, private router: Router) { }

    handleSignup(authData: AuthData) {
        this.isLoading = true
        this.http.post<{ message: string, user: AuthData }>(BACKEND_URL + 'signup', authData)
            .subscribe( response => {
                this.isLoading = false;
                this.router.navigate(['/auth/login']);
            }, error => {
                this.isLoading = false;
                this.router.navigate(['/auth/signup'])
            })
    }

    handleLogin(authData: AuthData) {
        this.isLoading = true;
        this.http.post<{ message: string, token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'login', authData)
            .subscribe( response => {
               this.token = response.token;
                this.isAuth = true;
                this.userId = response.userId;
                this.isAuthenticated.next(true); 
                this.saveAuthData(this.token, response.expiresIn, this.userId)
                this.autoLogout(response.expiresIn*1000)
                this.isLoading = false;
                this.router.navigate(['/']);
            }, error => {
                this.isLoading = false;
                this.isAuthenticated.next(false); 
                this.router.navigate(['/auth/login']);
            })
    }

    handleLogout() {
        this.isLoading = true;
        this.token = null;
        this.isAuth = false;
        this.userId = null;
        this.isAuthenticated.next(false);
        this.clearAuthData();
        clearTimeout(this.logoutTimer);
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
    }

    saveAuthData(token: string, expiresIn: number, userId: string) {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        //toISOString instead toString allows to reconvert the string to a date
        localStorage.setItem('expirationDate', expirationDate.toISOString())

    }

    getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expirationDate');
        const userId = localStorage.getItem('userId');
        return { 
            token,
            expirationDate,
            userId
        }
    }

    autoLogin(){
        const { token, expirationDate, userId } = this.getAuthData();
        if(!token || !expirationDate) {
            return
        }
        const now = new Date();
        const expirationTime = new Date(expirationDate).getTime() - now.getTime();
        if(expirationTime < 0){
            return this.handleLogout();
        }
        //
        this.token = token;
        this.isAuth = true;
        this.userId = userId;
        this.isAuthenticated.next(true); 
        this.autoLogout(expirationTime);
        this.isLoading = false;
        this.router.navigate(['/']);


    }

    autoLogout(time: number) {
        this.logoutTimer = setTimeout(()=> {
            this.handleLogout();
        }, time)
    }

    clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
    }

    getJWToken() {
        return this.token;
    }

    getIsAuthenticatedListener() {
        return this.isAuthenticated.asObservable();
    }

    getIsAuth() {
        return this.isAuth;
    }

    getUserId() {
        return this.userId;
    }


}