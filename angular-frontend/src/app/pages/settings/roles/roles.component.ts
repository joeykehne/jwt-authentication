import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { I_Role } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-roles',
	templateUrl: './roles.component.html',
	styleUrl: './roles.component.scss',
})
export class RolesComponent {
	roles: I_Role[] = [];

	constructor(private http: HttpClient) {}

	async ngOnInit() {
		this.roles = await firstValueFrom(
			this.http.get<I_Role[]>(`${environment.apiUrl}/roles`)
		);
	}
}
