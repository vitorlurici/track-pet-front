import "./RegisterPet.scss";
import { cadastrarAnimal } from "../services/animalService";
import { useState } from "react";
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

  // Ao selecionar a foto normalmente
  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  // Ao arrastar e soltar
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  // Evita o comportamento padrão do navegador
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
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

      // Foto agora é opcional
      await cadastrarAnimal(dados, foto ?? undefined);

      alert("Pet cadastrado com sucesso!");
      navigate("/painel");
    } catch (err) {
      console.error(err);
      setErro("Erro ao cadastrar o pet.");
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
        <div
          className="left-container"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div
            className="picture"
            style={{
              backgroundImage: preview ? `url(${preview})` : "none",
              backgroundColor: preview ? "transparent" : "#ccc",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!preview && (
              <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
                Arraste uma foto aqui
              </p>
            )}
          </div>

          <input
            type="file"
            id="foto"
            accept="image/*"
            onChange={handleFotoChange}
            style={{ display: "none" }}
          />

          {/* O label precisa envolver o botão corretamente */}
          <label htmlFor="foto">
            <button type="button">Carregar foto</button>
          </label>
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

          {erro && <p style={{ color: "red" }}>{erro}</p>}
        </div>
      </div>
    </main>
  );
}