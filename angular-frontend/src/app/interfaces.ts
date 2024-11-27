export interface I_Toast {
	id?: string;
	message: string;
	type: 'success' | 'info' | 'error';
}

export interface I_User {
	id?: string;
	name: string;
	email: string;
	isPaying: boolean;
	password?: string;
	roles?: I_Role[];
}

export interface I_NavSection {
	name: string;
	urls: { name: string; routerLink: string }[];
}

export interface I_Permission {
	id?: string;
	name: string;
	description: string;
	roles?: I_Role[];
}

export interface I_Role {
	id?: string;
	name: string;
	permissions: I_Permission[];
}

export interface I_FormField {
	type: 'text' | 'number' | 'select' | 'email' | 'password' | 'textarea';
	label: string;
	name: string;
	required: boolean;
	value?: any;
	selectOptions?: { key: string; value: string }[];
}
