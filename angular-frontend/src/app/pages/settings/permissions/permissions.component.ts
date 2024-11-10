import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { I_Permission } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { AddPermissionDialogComponent } from './add-permission-dialog/add-permission-dialog.component';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrl: './permissions.component.scss',
})
export class PermissionsComponent {
	permissions: I_Permission[] = [];

	constructor(private http: HttpClient, private dialog: MatDialog) {}

	async ngOnInit() {
		await this.reloadPermissions();
	}

	async reloadPermissions() {
		this.permissions = await firstValueFrom(
			this.http.get<I_Permission[]>(`${environment.apiUrl}/permissions`)
		);
	}

	async onAddPermission() {
		const dialogRef = this.dialog.open(AddPermissionDialogComponent);

		const response = await firstValueFrom(dialogRef.afterClosed());

		this.permissions.push(response);
	}
}
