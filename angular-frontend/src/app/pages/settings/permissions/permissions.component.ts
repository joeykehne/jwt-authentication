import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrl: './permissions.component.scss',
})
export class PermissionsComponent {
	permissions: any[] = [];

	constructor(private http: HttpClient) {}

	async ngOnInit() {
		this.permissions = await firstValueFrom(
			this.http.get<any[]>(`${environment.apiUrl}/permissions`)
		);
	}
}
