import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CopyCodeBoxComponent } from 'src/app/components/copy-code-box/copy-code-box.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PermissionSelectorComponent } from 'src/app/components/permission-selector/permission-selector.component';
import { RoleSelectorComponent } from 'src/app/components/role-selector/role-selector.component';
import { AddPermissionDialogComponent } from './permissions/add-permission-dialog/add-permission-dialog.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { UpdatePermissionDialogComponent } from './permissions/update-permission-dialog/update-permission-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { AddRoleDialogComponent } from './roles/add-role-dialog/add-role-dialog.component';
import { RolesComponent } from './roles/roles.component';
import { UpdateRoleDialogComponent } from './roles/update-role-dialog/update-role-dialog.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { UpdateUserDialogComponent } from './users/update-user-dialog/update-user-dialog.component';
import { UsersComponent } from './users/users.component';

@NgModule({
	declarations: [
		SettingsComponent,
		UsersComponent,
		RolesComponent,
		PermissionsComponent,
		ProfileComponent,
		AddPermissionDialogComponent,
		UpdatePermissionDialogComponent,
		AddRoleDialogComponent,
		UpdateRoleDialogComponent,
		UpdateUserDialogComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		MatDialogModule,
		SettingsRoutingModule,
		ReactiveFormsModule,
		PermissionSelectorComponent,
		RoleSelectorComponent,
		LoadingComponent,
		CopyCodeBoxComponent,
	],
})
export class SettingsModule {}
