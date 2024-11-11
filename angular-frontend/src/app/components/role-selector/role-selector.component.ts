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
import { I_Role } from 'src/app/interfaces';

@Component({
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormsModule],
	selector: 'app-role-selector',
	templateUrl: './role-selector.component.html',
	styleUrls: ['./role-selector.component.scss'],
})
export class RoleSelectorComponent implements OnInit, OnChanges {
	@Input() roles: I_Role[] = [];
	@Input() selectedRoleIds: string[] = [];

	@Output() selectedRoleIdsChange: EventEmitter<string[]> = new EventEmitter<
		string[]
	>();

	filteredRoles: I_Role[] = [];
	searchTerm: string = '';

	ngOnInit(): void {
		this.filteredRoles = [...this.roles];
	}

	ngOnChanges(changes: any): void {
		if (changes.roles) {
			this.filterRoles();
		}
	}

	filterRoles() {
		const search = this.searchTerm.toLowerCase();

		if (!search) {
			this.filteredRoles = [...this.roles];
			return;
		}

		this.filteredRoles = this.roles.filter((role) =>
			role.name.toLowerCase().includes(search)
		);
	}

	isSelected(role: I_Role): boolean {
		return this.selectedRoleIds.includes(role.id!);
	}

	toggleRole(role: I_Role) {
		if (this.isSelected(role)) {
			this.selectedRoleIds = this.selectedRoleIds.filter(
				(id) => id !== role.id
			);
		} else {
			this.selectedRoleIds.push(role.id!);
		}
		this.selectedRoleIdsChange.emit(this.selectedRoleIds);
	}
}
