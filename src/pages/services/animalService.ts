import api from "./api";
import type{ Animal } from "../types/animal";
import type { Leitura } from "../types/leitura";

export async function getAnimais(): Promise<Animal[]> {
  const response = await api.get<Animal[]>("/animal");  
  return response.data;
}

export async function getAnimalById(id: string): Promise<Animal> {
  const response = await api.get<Animal>(`/animal/${id}`);
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

export async function updateAnimal(id: string, dados: {
  nome: string;
  dataNascimento: string | null;
  peso: number;
  situacao: string;
  raca: string;
  sexo: string;
  cor: string;
}): Promise<Animal> {
  const response = await api.put(`/animal/${id}`, dados);
  return response.data;
}

export async function getLeiturasByAnimalId(idAnimal: string): Promise<Leitura[]> {
  const response = await api.get<Leitura[]>(`/leitura/animal/${idAnimal}`);
  return response.data;
}

export async function getLeituraById(idLeitura: string): Promise<Leitura> {
  const response = await api.get<Leitura>(`/leitura/${idLeitura}`);
  return response.data;
}

export async function getRastreamentoById(idLeitura: string): Promise<Leitura> {
  const response = await api.get<Leitura>(`/leitura/${idLeitura}`);
  return response.data;
}