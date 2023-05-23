import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
//here AuthService is only required to get the token, not for enable a guard on request from AuthService
import { Observable, catchError, throwError } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from "./error/error.component";


// in app.module.ts --> providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ]

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    

    constructor(public dialog: MatDialog) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occured'
            if(error.error.message) {
                errorMessage = error.error.message
            }
            this.dialog.open(ErrorComponent, { data: { message: errorMessage } })
            return throwError(errorMessage)
        }));        
    }
}