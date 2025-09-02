export interface AuthBody {
	email: string;
	password: string;
}

export interface SignUpBody {
	name: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	name: string;
	email: string;
	access_token: string;
	refresh_token: string;
}

export interface SignUpResponse {
	user_id: string;
	email: string;
	password: string;
	name: string;
	profile_image: null | string;
	totp_secret: null | string;
	is_2fa_active: boolean;
	created_at: string;
	updated_at: string;
}
