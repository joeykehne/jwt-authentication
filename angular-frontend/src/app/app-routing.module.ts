import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { ForgotPasswordComponent } from './pages/_auth/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/_auth/login/login.component';
import { LogoutComponent } from './pages/_auth/logout/logout.component';
import { RegisterComponent } from './pages/_auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ProtectedComponent } from './pages/protected/protected.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [LoggedInGuard],
	},
	{
		path: 'forgotPassword',
		component: ForgotPasswordComponent,
	},
	{ path: 'logout', component: LogoutComponent },
	{
		path: 'protected',
		component: ProtectedComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
