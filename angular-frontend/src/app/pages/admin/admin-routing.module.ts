import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
	{
		path: 'admin',
		component: AdminComponent,
		children: [
			{ path: '', redirectTo: 'users', pathMatch: 'full' },
			{ path: 'roles', component: RolesComponent },
			{ path: 'users', component: UsersComponent },
			{ path: 'permissions', component: PermissionsComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
