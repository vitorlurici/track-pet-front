import api from "./api";
import type{ Animal } from "../types/animal";

export async function getAnimais(): Promise<Animal[]> {
  const response = await api.get<Animal[]>("/animal");  
  return response.data;
}

export async function cadastrarAnimal(dados: any, foto?: File) {
  const formData = new FormData();
  formData.append("dados", JSON.stringify(dados));
  if (foto) formData.append("foto", foto);

  const response = await api.post("/animal/foto", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}