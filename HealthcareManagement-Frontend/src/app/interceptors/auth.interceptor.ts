import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const cloned = req.clone({
        setHeaders: { Authorization: authHeader }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
