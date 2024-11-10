import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddPermissionDialogComponent } from './add-permission-dialog/add-permission-dialog.component';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrl: './permissions.component.scss',
})
export class PermissionsComponent {
	permissions: any[] = [];

	constructor(private http: HttpClient, private dialog: MatDialog) {}

	async ngOnInit() {
		this.permissions = await firstValueFrom(
			this.http.get<any[]>(`${environment.apiUrl}/permissions`)
		);
	}

	async onAddPermission() {
		this.dialog.open(AddPermissionDialogComponent);
	}
}
