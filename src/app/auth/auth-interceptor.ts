import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
//here AuthService is only required to get the token, not for enable a guard on request from AuthService
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

// in app.module.ts --> providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ]

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    

    constructor(private authService: AuthService) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getJWToken();
        // Here it is required to clone the request, because managing direct the request it would cause side effects
        const authRequest = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + authToken) })
        return next.handle(authRequest);        
    }
}