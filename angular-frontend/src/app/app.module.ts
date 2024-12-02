import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatDialogModule,
} from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ForgotPasswordComponent } from './pages/_auth/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/_auth/login/login.component';
import { LogoutComponent } from './pages/_auth/logout/logout.component';
import { RegisterComponent } from './pages/_auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ProtectedComponent } from './pages/protected/protected.component';
import { SettingsModule } from './pages/settings/settings.module';
import { ResetPasswordComponent } from './pages/_auth/reset-password/reset-password.component';

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
		ConfirmationDialogComponent,
		ForgotPasswordComponent,
  ResetPasswordComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatDialogModule,
		HttpClientModule,
		ReactiveFormsModule,
		SettingsModule,
		FormsModule,
		LoadingComponent,
		DynamicFormComponent,
		CardComponent
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
