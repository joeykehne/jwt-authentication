import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatDialogModule,
} from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './pages/_auth/login/login.component';
import { LogoutComponent } from './pages/_auth/logout/logout.component';
import { RegisterComponent } from './pages/_auth/register/register.component';
import { AdminModule } from './pages/admin/admin.module';
import { HomeComponent } from './pages/home/home.component';
import { ProtectedComponent } from './pages/protected/protected.component';

@NgModule({
	declarations: [
		AppComponent,
		ProtectedComponent,
		LoginComponent,
		HomeComponent,
		RegisterComponent,
		LogoutComponent,
		NavbarComponent,
		FooterComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatDialogModule,
		HttpClientModule,
		ReactiveFormsModule,
		AdminModule,
	],
	providers: [
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: { width: 'clamp(300px, 60%, 95%)' },
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
		provideAnimationsAsync(),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
