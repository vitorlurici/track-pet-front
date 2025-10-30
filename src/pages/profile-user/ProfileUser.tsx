import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProfileUser.scss";
import { getUsuario, updateUsuario } from "../services/usuarioService";
import type { Usuario } from "../types/usuario";

export default function ProfileUser() {
  const [form, setForm] = useState<Omit<Usuario, "id">>({
    nome: "",
    sobrenome: "",
    cidade: "",
    bairro: "",
    numero: "",
    telefone: "",
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      setLoading(true);
      try {
        const usuario = await getUsuario();
        const { nome, sobrenome, cidade, bairro, numero, telefone } = usuario;
        setForm({ nome, sobrenome, cidade, bairro, numero, telefone });
      } catch (e) {
        setErro("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    }
    carregarUsuario();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErro("");
    try {
      await updateUsuario(form);
      setMsg("Dados atualizados com sucesso!");
    } catch (e: any) {
      if (e?.response?.status === 403) setErro("Não autorizado.");
      else setErro("Erro ao atualizar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <main className="profile-main">
      <div className="top">
        <div className="left">
          <Link to={"/painel"}>
            <button>Voltar</button>
          </Link>
        </div>
        <div className="right">
          <h2>Atualizar cadastro</h2>
        </div>
      </div>
      <div className="content-container">
        <div className="left-container">
          <div className="picture"></div>
          <button>Carregar foto</button>
        </div>
        <div className="right-container">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" />
            </div>
            <div className="field">
              <label>Sobrenome</label>
              <input name="sobrenome" value={form.sobrenome} onChange={handleChange} placeholder="Sobrenome" />
            </div>
            <div className="field">
              <label>Cidade</label>
              <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" />
            </div>
            <div className="field">
              <label>Bairro</label>
              <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" />
            </div>
            <div className="field">
              <label>Número</label>
              <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" />
            </div>
            <div className="field">
              <label>Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar cadastro"}
            </button>
            {msg && <div style={{ color: "green" }}>{msg}</div>}
            {erro && <div style={{ color: "red" }}>{erro}</div>}
          </form>
        </div>
      </div>
    </main>
  );
}
