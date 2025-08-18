import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔗 AuthInterceptor: Intercepting request to:', req.url);
    
    const token = this.authService.getToken();
    
    if (token) {
      console.log('🔗 AuthInterceptor: Adding token to request');
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    } else {
      console.log('🔗 AuthInterceptor: No token found, proceeding without auth header');
    }
    
    return next.handle(req);
  }
} 