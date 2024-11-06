export interface I_Toast {
	id?: string;
	message: string;
	type: 'success' | 'info' | 'error';
}

export interface I_User {
	name: string;
	email: string;
	roles?: string[];
	password?: string;
}
