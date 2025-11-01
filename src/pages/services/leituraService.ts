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

