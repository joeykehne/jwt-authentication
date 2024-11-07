import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-roles',
	templateUrl: './roles.component.html',
	styleUrl: './roles.component.scss',
})
export class RolesComponent {
	roles: any[] = [];

	constructor(private http: HttpClient) {}

	async ngOnInit() {
		this.roles = await firstValueFrom(
			this.http.get<any[]>(`${environment.apiUrl}/roles`)
		);
	}
}
