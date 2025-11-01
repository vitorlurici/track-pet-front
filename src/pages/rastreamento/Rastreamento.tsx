import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Rastreamento.scss";
import { getRastreamentoById } from "../services/animalService";
import type { Leitura } from "../types/leitura";

export default function Rastreamento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rastreamento, setRastreamento] = useState<Leitura | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const mapContainer = useRef<HTMLDivElement>(null);
  const [idAnimal, setIdAnimal] = useState<string>("");

  useEffect(() => {
    if (!id) {
      navigate("/painel");
      return;
    }

    async function carregarRastreamento() {
      setLoading(true);
      setErro("");
      try {
        const data = await getRastreamentoById(id);
        setRastreamento(data);
        setIdAnimal(data.idAnimal || data.animalId || "");
      } catch (error: any) {
        if (error.response?.status === 404) {
          setErro("Rastreamento não encontrado.");
        } else {
          setErro("Erro ao carregar dados do rastreamento.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarRastreamento();
  }, [id, navigate]);

  // Carrega o mapa quando os dados estão disponíveis
  useEffect(() => {
    if (!rastreamento || !mapContainer.current) return;

    const lat = parseFloat(String(rastreamento.latitude));
    const lng = parseFloat(String(rastreamento.longitude));

    if (isNaN(lat) || isNaN(lng)) {
      setErro("Coordenadas inválidas");
      return;
    }

    // Adiciona loading
    mapContainer.current.innerHTML = '<div class="mapa-loading">Carregando mapa...</div>';

    // Cria iframe do mapa
    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      const iframe = document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.frameBorder = "0";
      iframe.style.border = "0";
      iframe.style.minHeight = "400px";
      iframe.allowFullscreen = true;
      iframe.loading = "eager";

      // Calcula bbox para zoom adequado
      const zoomLevel = 15;
      const bboxSize = 0.01;
      const bbox = `${lng - bboxSize},${lat - bboxSize},${lng + bboxSize},${lat + bboxSize}`;

      // URL do OpenStreetMap com marcador
      iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}&zoom=${zoomLevel}`;

      // Remove loading quando o iframe carregar e adiciona o iframe
      iframe.onload = () => {
        if (mapContainer.current) {
          const loading = mapContainer.current.querySelector('.mapa-loading');
          if (loading) {
            loading.remove();
          }
        }
      };

      // Adiciona o iframe (o loading será removido quando carregar)
      mapContainer.current.appendChild(iframe);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapContainer.current) {
        mapContainer.current.innerHTML = "";
      }
    };
  }, [rastreamento]);

  function formatarDataHora(dataHora: string): string {
    if (!dataHora) return "";
    try {
      const date = new Date(dataHora);
      return date.toLocaleString("pt-BR");
    } catch {
      return dataHora;
    }
  }

  function handleRastrear() {
    if (!rastreamento) return;

    const lat = parseFloat(String(rastreamento.latitude));
    const lng = parseFloat(String(rastreamento.longitude));

    if (isNaN(lat) || isNaN(lng)) return;

    // Abre no aplicativo de mapas do dispositivo
    // Funciona com Google Maps, Apple Maps, etc.
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  }

  function handleVoltar() {
    if (idAnimal) {
      navigate(`/pet/${idAnimal}`);
    } else {
      navigate("/painel");
    }
  }

  if (loading) {
    return (
      <main className="rastreamento-main">
        <div className="rastreamento-header">
          <button onClick={handleVoltar}>← Voltar</button>
        </div>
        <div className="loading-container">
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  if (erro || !rastreamento) {
    return (
      <main className="rastreamento-main">
        <div className="rastreamento-header">
          <button onClick={handleVoltar}>← Voltar</button>
        </div>
        <div className="error-container">
          <p>{erro || "Rastreamento não encontrado"}</p>
        </div>
      </main>
    );
  }

  const lat = parseFloat(String(rastreamento.latitude));
  const lng = parseFloat(String(rastreamento.longitude));

  return (
    <main className="rastreamento-main">
      <div className="rastreamento-header">
        <div className="header-info">
          <h1>Localização de uso do serviço</h1>
          <p className="coordinates">
            Location: {rastreamento.latitude}, {rastreamento.longitude}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-rastrear" onClick={handleRastrear}>
            Rastrear
          </button>
          <button className="btn-fechar" onClick={handleVoltar}>
            ×
          </button>
        </div>
      </div>

      <div className="rastreamento-content">
        <div className="mapa-container" ref={mapContainer}></div>

        <div className="rastreamento-details">
          <div className="detail-item">
            <strong>Data/Hora:</strong>
            <span>{formatarDataHora(rastreamento.dataHora)}</span>
          </div>

          {rastreamento.mensagem && (
            <div className="detail-item">
              <strong>Mensagem:</strong>
              <span>{rastreamento.mensagem}</span>
            </div>
          )}

          <div className="detail-item">
            <strong>Coordenadas:</strong>
            <span>
              {rastreamento.latitude}, {rastreamento.longitude}
            </span>
          </div>

          {rastreamento.endereco && (
            <div className="detail-item">
              <strong>Endereço:</strong>
              <span>{rastreamento.endereco}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

