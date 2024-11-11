import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { I_User } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
	users: I_User[] = [];

	constructor(private http: HttpClient, private dialog: MatDialog) {}

	async ngOnInit() {
		this.users = await firstValueFrom(
			this.http.get<I_User[]>(`${environment.apiUrl}/users`)
		);
	}

	async onUpdateUser(user: I_User) {
		const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
			data: user,
		});

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (response) {
			const index = this.users?.findIndex((user) => user.id === response.id);
			this.users[index] = response;
		}
	}
}
