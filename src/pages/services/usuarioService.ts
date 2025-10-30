import api from "./api";
import type { Usuario } from "../types/usuario";

export async function getUsuario(): Promise<Usuario> {
  const response = await api.get<Usuario>("/usuario");
  return response.data;
}

export async function updateUsuario(usuario: Omit<Usuario, "id">): Promise<Usuario> {
  const response = await api.put<Usuario>("/usuario", usuario);
  return response.data;
}