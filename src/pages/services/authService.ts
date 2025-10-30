import api from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth";
import type { RegistroRequest } from "../types/registro-request";

// Armazena token + timestamp
export function setToken(token: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("token_time", Date.now().toString());
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("token_time");
}

export function getTokenData() {
  const token = localStorage.getItem("token");
  const time = localStorage.getItem("token_time");
  return { token, time: time ? +time : null };
}

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}

export async function registrarUsuario(dados: RegistroRequest) {
  try {
    const response = await api.post("/auth/registrar", dados);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error("E-mail já cadastrado.");
    }
    if (error.response?.status === 400) {
      throw new Error("Campos obrigatórios inválidos ou ausentes.");
    }
    throw new Error("Erro inesperado ao registrar usuário.");
  }
}