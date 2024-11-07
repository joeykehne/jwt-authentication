import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PermissionsComponent } from './permissions/permissions.component';
import { ProfileComponent } from './profile/profile.component';
import { RolesComponent } from './roles/roles.component';
import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
	{
		path: 'settings',
		component: SettingsComponent,
		children: [
			{ path: '', redirectTo: 'users', pathMatch: 'full' },
			{ path: 'profile', component: ProfileComponent },
			{
				path: 'roles',
				component: RolesComponent,
				canActivate: [PermissionGuard],
				data: { permission: 'iam' },
			},
			{
				path: 'users',
				component: UsersComponent,
				canActivate: [PermissionGuard],
				data: { permission: 'iam' },
			},
			{
				path: 'permissions',
				component: PermissionsComponent,
				canActivate: [PermissionGuard],
				data: { permission: 'iam' },
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SettingsRoutingModule {}
