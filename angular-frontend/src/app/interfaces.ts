export interface I_Toast {
	id?: string;
	message: string;
	type: 'alert-success' | 'alert-info' | 'alert-error';
}

export interface I_User {
	name: string;
	email: string;
	roles?: string[];
	password?: string;
}
