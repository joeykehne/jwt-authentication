import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AddPermissionDialogComponent } from './permissions/add-permission-dialog/add-permission-dialog.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { ProfileComponent } from './profile/profile.component';
import { RolesComponent } from './roles/roles.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';

@NgModule({
	declarations: [
		SettingsComponent,
		UsersComponent,
		RolesComponent,
		PermissionsComponent,
		ProfileComponent,
		AddPermissionDialogComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		MatDialogModule,
		SettingsRoutingModule,
		ReactiveFormsModule,
	],
})
export class SettingsModule {}
