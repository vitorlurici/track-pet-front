import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./InformarEncontro.scss";

import { enviarLeituraQr, getAnimalPublico } from "../services/leituraService";
import type { AnimalPublico } from "../services/leituraService";

export default function InformarEncontro() {
  const { idAnimal } = useParams<{ idAnimal: string }>();
  const [mensagem, setMensagem] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [localizacaoPermitida, setLocalizacaoPermitida] = useState(false);
  const [solicitandoLocalizacao, setSolicitandoLocalizacao] = useState(false);
  const [animal, setAnimal] = useState<AnimalPublico | null>(null);
  const [carregandoAnimal, setCarregandoAnimal] = useState(true);

  useEffect(() => {
    if (!idAnimal) {
      setErro("ID do animal não encontrado.");
      setCarregandoAnimal(false);
      return;
    }

    // Busca dados do animal
    buscarDadosAnimal();
    // Solicita permissão de localização ao carregar a página
    solicitarLocalizacao();
  }, [idAnimal]);

  async function buscarDadosAnimal() {
    if (!idAnimal) return;

    setCarregandoAnimal(true);
    try {
      const dadosAnimal = await getAnimalPublico(idAnimal);
      setAnimal(dadosAnimal);
    } catch (error: any) {
      console.error("Erro ao buscar dados do animal:", error);
      if (error.response?.status === 404) {
        setErro("Animal não encontrado.");
      } else {
        setErro("Erro ao carregar dados do animal.");
      }
    } finally {
      setCarregandoAnimal(false);
    }
  }

  async function solicitarLocalizacao() {
    if (!navigator.geolocation) {
      setErro("Seu navegador não suporta geolocalização.");
      return;
    }

    setSolicitandoLocalizacao(true);
    setErro("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setLocalizacaoPermitida(true);
        setSolicitandoLocalizacao(false);
      },
      (error) => {
        setSolicitandoLocalizacao(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErro("Permissão de localização negada. Por favor, permita o acesso à localização para continuar.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErro("Localização indisponível.");
            break;
          case error.TIMEOUT:
            setErro("Tempo esgotado ao obter localização.");
            break;
          default:
            setErro("Erro ao obter localização.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!idAnimal) {
      setErro("ID do animal não encontrado.");
      return;
    }

    if (!mensagem.trim()) {
      setErro("Por favor, digite uma mensagem.");
      return;
    }

    if (!latitude || !longitude) {
      setErro("Localização não disponível. Por favor, permita o acesso à localização.");
      return;
    }

    setLoading(true);
    setErro("");
    setSucesso(false);

    try {
      await enviarLeituraQr(idAnimal, {
        latitude,
        longitude,
        mensagem: mensagem.trim(),
      });

      setSucesso(true);
      setMensagem("");
    } catch (error: any) {
      console.error("Erro ao enviar:", error);
      if (error.response?.status === 404) {
        setErro("Animal não encontrado.");
      } else if (error.response?.status === 400) {
        setErro(error.response?.data?.message || "Dados inválidos. Verifique as informações.");
      } else {
        setErro("Erro ao enviar informações. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="informar-encontro">
      <div className="container">
        <div className="header">
          <h1>Encontrei um Pet!</h1>
          <p>Informe a localização e uma mensagem para o dono</p>
        </div>

        {carregandoAnimal ? (
          <div className="carregando-animal">
            <p>Carregando dados do pet...</p>
          </div>
        ) : animal ? (
          <div className="pet-info">
            {animal.fotoUrl && (
              <div className="pet-foto">
                <img src={animal.fotoUrl} alt={animal.nome} />
              </div>
            )}
            <div className="pet-dados">
              <h2>Olá, sou o {animal.nome} e estou perdido</h2>
              <div className="pet-detalhes">
                <div className="detalhe-item">
                  <span className="label">Cor:</span>
                  <span className="valor">{animal.cor.charAt(0).toUpperCase() + animal.cor.slice(1).toLowerCase()}</span>
                </div>
                <div className="detalhe-item">
                  <span className="label">Sexo:</span>
                  <span className="valor">
                    {animal.sexo === "M" || animal.sexo === "MACHO" 
                      ? "Macho" 
                      : animal.sexo === "F" || animal.sexo === "FEMEA"
                      ? "Fêmea"
                      : animal.sexo}
                  </span>
                </div>
                {animal.peso && (
                  <div className="detalhe-item">
                    <span className="label">Peso:</span>
                    <span className="valor">{animal.peso} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {sucesso ? (
          <div className="sucesso-message">
            <h2>✓ Informações enviadas com sucesso!</h2>
            <p>O dono do pet receberá suas informações. Obrigado por ajudar!</p>
          </div>
        ) : (
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="localizacao-status">
              {solicitandoLocalizacao ? (
                <div className="status-info">
                  <p>📍 Solicitando permissão de localização...</p>
                </div>
              ) : localizacaoPermitida ? (
                <div className="status-info success">
                  <p>✓ Localização obtida: {latitude}, {longitude}</p>
                  <button
                    type="button"
                    onClick={solicitarLocalizacao}
                    className="btn-atualizar-loc"
                  >
                    Atualizar localização
                  </button>
                </div>
              ) : (
                <div className="status-info error">
                  <p>⚠ Localização não disponível</p>
                  <button
                    type="button"
                    onClick={solicitarLocalizacao}
                    className="btn-tentar-novamente"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="mensagem">
                Mensagem para o dono <span className="required">*</span>
              </label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Ex: Encontrei seu pet na rua X, próximo ao parque. Ele está bem e seguro!"
                rows={5}
                required
              />
              <span className="help-text">
                Descreva onde encontrou o pet e como ele está
              </span>
            </div>

            {erro && <div className="erro-message">{erro}</div>}

            <button
              type="submit"
              className="btn-enviar"
              disabled={loading || !localizacaoPermitida || !mensagem.trim()}
            >
              {loading ? "Enviando..." : "Enviar Informações"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

