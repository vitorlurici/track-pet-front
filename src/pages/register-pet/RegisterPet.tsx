import "./RegisterPet.scss";
import { cadastrarAnimal } from "../services/animalService";
import { useState, useRef } from "react";
import type { ChangeEvent , DragEvent} from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPet() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [peso, setPeso] = useState("");
  const [raca, setRaca] = useState("");
  const [sexo, setSexo] = useState("");
  const [cor, setCor] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tamanho máximo permitido: 5MB (5 * 1024 * 1024 bytes)
  const TAMANHO_MAXIMO_FOTO = 5 * 1024 * 1024; // 5MB

  // Valida o tamanho do arquivo
  function validarArquivo(file: File): string | null {
    // Verifica se é uma imagem
    if (!file.type.startsWith("image/")) {
      return "Por favor, selecione um arquivo de imagem.";
    }

    // Verifica o tamanho do arquivo
    if (file.size > TAMANHO_MAXIMO_FOTO) {
      const tamanhoMB = (file.size / (1024 * 1024)).toFixed(2);
      return `O arquivo é muito grande (${tamanhoMB} MB). O tamanho máximo permitido é 5 MB. Por favor, escolha uma imagem menor ou comprima o arquivo.`;
    }

    return null;
  }

  // Ao selecionar a foto normalmente
  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const erroValidacao = validarArquivo(file);
      if (erroValidacao) {
        setErro(erroValidacao);
        setFoto(null);
        setPreview(null);
        // Limpa o input
        e.target.value = "";
        return;
      }

      setErro(null);
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  // Ao arrastar e soltar
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation(); // Evita que dispare o onClick
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const erroValidacao = validarArquivo(file);
      if (erroValidacao) {
        setErro(erroValidacao);
        setFoto(null);
        setPreview(null);
        return;
      }

      setErro(null);
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  // Evita o comportamento padrão do navegador
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  // Abre o explorador de arquivos ao clicar na área da foto
  function handleFotoClick() {
    fileInputRef.current?.click();
  }

  async function handleSubmit() {
    if (!nome || !peso || !raca || !sexo || !cor) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    setErro(null);
    setLoading(true);

    try {
      const dados = {
        nome,
        peso: parseFloat(peso),
        raca,
        sexo,
        cor,
      };

      // Valida novamente o tamanho da foto antes de enviar (caso tenha mudado)
      if (foto) {
        const erroValidacao = validarArquivo(foto);
        if (erroValidacao) {
          setErro(erroValidacao);
          setLoading(false);
          return;
        }
      }

      // Foto agora é opcional
      await cadastrarAnimal(dados, foto ?? undefined);

      alert("Pet cadastrado com sucesso!");
      navigate("/painel");
    } catch (err: any) {
      console.error(err);
      
      // Trata especificamente o erro de tamanho máximo excedido
      if (err?.response?.status === 413 || err?.response?.data?.message?.includes("Maximum upload size")) {
        setErro("O arquivo de foto é muito grande. O tamanho máximo permitido é 5 MB. Por favor, escolha uma imagem menor ou comprima o arquivo.");
      } else if (err?.response?.status === 400) {
        setErro(err?.response?.data?.message || "Dados inválidos. Verifique os campos preenchidos.");
      } else {
        setErro("Erro ao cadastrar o pet. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-pet">
      <div className="top">
        <div className="left">
          <Link to={"/painel"}>
            <button>Voltar</button>
          </Link>
        </div>
        <div className="right">
          <h2>Cadastre seu Pet</h2>
        </div>
      </div>

      <div className="content-container">
        <div className="left-container">
          <div
            className="foto-upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleFotoClick}
          >
            <div
              className="picture"
              style={{
                backgroundImage: preview ? `url(${preview})` : "none",
                backgroundColor: preview ? "transparent" : "#f0f0f0",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!preview && (
                <div className="foto-placeholder">
                  <p className="foto-text-main">Arraste a foto aqui</p>
                  <p className="foto-text-sub">ou clique para selecionar</p>
                </div>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            id="foto"
            accept="image/*"
            onChange={handleFotoChange}
            style={{ display: "none" }}
          />

          <p className="foto-info">
            Tamanho máximo: 5 MB
          </p>
        </div>

        <div className="right-container">
          <div className="field">
            <label>Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
            />
          </div>

          <div className="field">
            <label>Peso (kg)</label>
            <input
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Peso"
            />
          </div>

          <div className="field">
            <label>Raça</label>
            <input
              value={raca}
              onChange={(e) => setRaca(e.target.value)}
              placeholder="Raça"
            />
          </div>

          <div className="field">
            <label>Sexo</label>
            <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="">Selecione</option>
              <option value="M">Macho</option>
              <option value="F">Fêmea</option>
            </select>
          </div>

          <div className="field">
            <label>Cor</label>
            <input
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              placeholder="Cor"
            />
          </div>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar Pet"}
          </button>

          {erro && (
            <div style={{ 
              color: "red", 
              backgroundColor: "#fee", 
              padding: "12px", 
              borderRadius: "8px", 
              border: "1px solid #fcc",
              marginTop: "8px"
            }}>
              {erro}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}