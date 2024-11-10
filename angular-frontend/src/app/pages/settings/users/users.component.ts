import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { I_User } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
	users: I_User[] = [];

	constructor(private http: HttpClient) {}

	async ngOnInit() {
		this.users = await firstValueFrom(
			this.http.get<I_User[]>(`${environment.apiUrl}/users`)
		);
	}
}
