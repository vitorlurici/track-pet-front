export interface Leitura {
  id: string;
  dataHora: string;
  latitude: number | string;
  longitude: number | string;
  endereco?: string;
  animalId: string;
  mensagem?: string;
  idAnimal?: string;
}

