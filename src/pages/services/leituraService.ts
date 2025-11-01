import axios from "axios";

// API pública sem autenticação para enviar leitura via QR code
const apiPublica = axios.create({
  baseURL: "http://localhost:8080",
});

export interface LeituraQrRequest {
  latitude: string;
  longitude: string;
  mensagem: string;
}

export async function enviarLeituraQr(idAnimal: string, dados: LeituraQrRequest) {
  const response = await apiPublica.post(`/leitura/${idAnimal}`, dados);
  return response.data;
}

export interface AnimalPublico {
  id: string;
  nome: string;
  peso: number;
  fotoUrl: string;
  sexo: string;
  cor: string;
}

export async function getAnimalPublico(idAnimal: string): Promise<AnimalPublico> {
  const response = await apiPublica.get<AnimalPublico>(`/animal/informacoes-publicas/${idAnimal}`);
  const animal = response.data;
  // Construir URL completa da foto se for um caminho relativo
  if (animal.fotoUrl && !animal.fotoUrl.startsWith('http')) {
    animal.fotoUrl = `${apiPublica.defaults.baseURL}${animal.fotoUrl}`;
  }
  return animal;
}


