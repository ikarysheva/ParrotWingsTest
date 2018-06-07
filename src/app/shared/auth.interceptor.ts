import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const idToken = this.auth.getToken();
        let request = req;
        if (idToken) {
            request = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${idToken}`
                }
            });
            // request = req.clone({ headers: req.headers.set('Authorization', `Bearer ${idToken}`) });
        }

        return next.handle(request);
    }
}
