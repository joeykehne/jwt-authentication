import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesComponent } from './roles/roles.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
	declarations: [
		SettingsComponent,
		UsersComponent,
		RolesComponent,
		PermissionsComponent,
  ProfileComponent,
	],
	imports: [CommonModule, RouterModule, SettingsRoutingModule],
})
export class SettingsModule {}
