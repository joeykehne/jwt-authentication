export interface I_Toast {
	id?: string;
	message: string;
	type: 'success' | 'info' | 'error';
}

export interface I_NavSection {
	name: string;
	urls: { name: string; routerLink: string }[];
}

export interface I_Validator {
	name: 'required' | 'minLength' | 'maxLength' | 'pattern' | string;
	value?: any;
	message?: string;
}

export interface I_FormField {
	type: 'text' | 'number' | 'select' | 'email' | 'password' | 'textarea';
	label: string;
	name: string;
	required: boolean;
	validators?: I_Validator[];
	value?: any;
	selectOptions?: { key: string; value: string }[];
}
