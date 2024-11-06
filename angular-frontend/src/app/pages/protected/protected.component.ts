import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-protected',
	templateUrl: './protected.component.html',
	styleUrl: './protected.component.scss',
})
export class ProtectedComponent implements OnInit {
	constructor(private http: HttpClient, private toastService: ToastService) {}

	async ngOnInit() {
		try {
			await firstValueFrom(this.http.get(`${environment.apiUrl}/protected`));

			this.toastService.addToast({
				type: 'success',
				message: 'You have the required permissions to access this page',
			});
		} catch (error) {
			this.toastService.addToast({
				type: 'error',
				message: 'You do not have the required permissions to access this page',
			});
		}
	}
}
