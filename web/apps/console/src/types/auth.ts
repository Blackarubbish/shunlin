export interface LoginForm {
	email: string;
	password: string;
	remember: boolean;
}

export interface User {
	id: number;
	email: string;
	username: string;
	avatar?: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

export interface LoginResponse {
	user: User;
	token: string;
	refreshToken: string;
	expiresIn: number;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
