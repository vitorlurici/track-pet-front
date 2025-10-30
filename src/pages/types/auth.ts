export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  authenticated: boolean;
  email: string;
  created: string;
  expiration: string;
  token: string;
}
