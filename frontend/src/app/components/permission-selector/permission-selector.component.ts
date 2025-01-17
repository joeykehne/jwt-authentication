import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I_Permission } from 'src/app/generated_interfaces';
import { LoadingComponent } from '../loading/loading.component';

@Component({
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingComponent],
	selector: 'app-permission-selector',
	templateUrl: './permission-selector.component.html',
	styleUrls: ['./permission-selector.component.scss'],
})
export class PermissionSelectorComponent implements OnInit, OnChanges {
	@Input() permissions: I_Permission[] = [];
	@Input() selectedPermissionIds: string[] = [];

	@Output() selectedPermissionIdsChange: EventEmitter<string[]> =
		new EventEmitter<string[]>();

	filteredPermissions: I_Permission[] = [];
	searchTerm: string = '';

	ngOnInit(): void {
		this.filteredPermissions = [...this.permissions];
	}

	ngOnChanges(changes: any): void {
		if (changes.permissions) {
			this.filterPermissions();
		}
	}

	filterPermissions() {
		const search = this.searchTerm.toLowerCase();

		if (!search) {
			this.filteredPermissions = [...this.permissions];
			return;
		}

		this.filteredPermissions = this.permissions.filter((permission) =>
			permission.name.toLowerCase().includes(search)
		);

		// only show first 6 results
		this.filteredPermissions = this.filteredPermissions.slice(0, 6);
	}

	isSelected(permission: I_Permission): boolean {
		return this.selectedPermissionIds.includes(permission.id!);
	}

	togglePermission(permission: I_Permission) {
		if (this.isSelected(permission)) {
			this.selectedPermissionIds = this.selectedPermissionIds.filter(
				(id) => id !== permission.id
			);
		} else {
			this.selectedPermissionIds.push(permission.id!);
		}
		this.selectedPermissionIdsChange.emit(this.selectedPermissionIds);
	}
}
