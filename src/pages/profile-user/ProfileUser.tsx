import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProfileUser.scss";
import { getUsuario, updateUsuario } from "../services/usuarioService";
import type { Usuario } from "../types/usuario";
import type { ChangeEvent } from "react";

export default function ProfileUser() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState<Omit<Usuario, "id">>({
    nome: "",
    sobrenome: "",
    cidade: "",
    bairro: "",
    numero: "",
    telefone: "",
  });

  useEffect(() => {
    async function carregarUsuario() {
      setLoading(true);
      setErro("");
      try {
        const usuarioData = await getUsuario();
        setUsuario(usuarioData);
        // Preenche o formulário com os dados do usuário
        setForm({
          nome: usuarioData.nome || "",
          sobrenome: usuarioData.sobrenome || "",
          cidade: usuarioData.cidade || "",
          bairro: usuarioData.bairro || "",
          numero: usuarioData.numero || "",
          telefone: usuarioData.telefone || "",
        });
      } catch (e: any) {
        if (e?.response?.status === 403) {
          setErro("Não autorizado.");
        } else {
          setErro("Erro ao carregar dados do usuário.");
        }
      } finally {
        setLoading(false);
      }
    }
    carregarUsuario();
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function abrirModal() {
    if (!usuario) return;
    // Preenche o formulário com os dados atuais ao abrir o modal
    setForm({
      nome: usuario.nome || "",
      sobrenome: usuario.sobrenome || "",
      cidade: usuario.cidade || "",
      bairro: usuario.bairro || "",
      numero: usuario.numero || "",
      telefone: usuario.telefone || "",
    });
    setErro("");
    setMsg("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setErro("");
    setMsg("");
  }

  async function handleSalvar() {
    if (!usuario) return;

    setSalvando(true);
    setErro("");
    setMsg("");

    try {
      const dadosAtualizados = {
        nome: form.nome.trim(),
        sobrenome: form.sobrenome.trim(),
        cidade: form.cidade.trim(),
        bairro: form.bairro.trim(),
        numero: form.numero.trim(),
        telefone: form.telefone.trim(),
      };

      const usuarioAtualizado = await updateUsuario(dadosAtualizados);
      setUsuario(usuarioAtualizado);
      setModalAberto(false);
      setMsg("Dados atualizados com sucesso!");

      // Atualiza os detalhes se estiverem visíveis
      if (detalhesVisiveis) {
        setForm({
          nome: usuarioAtualizado.nome || "",
          sobrenome: usuarioAtualizado.sobrenome || "",
          cidade: usuarioAtualizado.cidade || "",
          bairro: usuarioAtualizado.bairro || "",
          numero: usuarioAtualizado.numero || "",
          telefone: usuarioAtualizado.telefone || "",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const mensagemErro = error.response?.data?.message || error.response?.data?.error || "Dados inválidos. Verifique os campos preenchidos.";
        setErro(`Erro: ${mensagemErro}`);
      } else if (error.response?.status === 403) {
        setErro("Não autorizado.");
      } else {
        setErro("Erro ao atualizar dados do usuário. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-main">
        <div className="top">
          <div className="left">
            <Link to={"/painel"}>
              <button>Voltar</button>
            </Link>
          </div>
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  if (erro && !usuario) {
    return (
      <main className="profile-main">
        <div className="top">
          <div className="left">
            <Link to={"/painel"}>
              <button>Voltar</button>
            </Link>
          </div>
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "red" }}>{erro}</p>
        </div>
      </main>
    );
  }

  if (!usuario) return null;

  const nomeCompleto = `${usuario.nome} ${usuario.sobrenome}`.trim();

  return (
    <>
      <main className="profile-main">
        <div className="top">
          <div className="left">
            <Link to={"/painel"}>
              <button>Voltar</button>
            </Link>
          </div>
        </div>

        <div className="user-header">
          <h1 className="user-name">Usuário {nomeCompleto || usuario.nome}</h1>
          <div className="user-actions">
            <button onClick={() => setDetalhesVisiveis(!detalhesVisiveis)} className="btn-detalhes">
              {detalhesVisiveis ? "Ocultar detalhes" : "Ver detalhes"}
            </button>
            <button onClick={abrirModal} className="btn-atualizar">
              Atualizar
            </button>
          </div>
        </div>

        {msg && <div className="msg-sucesso">{msg}</div>}

        {/* Seção de Detalhes (oculta por padrão) */}
        {detalhesVisiveis && (
          <div className="detalhes-container">
            {usuario.nome && (
              <div className="field">
                <label>Nome</label>
                <input disabled value={usuario.nome} placeholder="Nome" />
              </div>
            )}

            {usuario.sobrenome && (
              <div className="field">
                <label>Sobrenome</label>
                <input disabled value={usuario.sobrenome} placeholder="Sobrenome" />
              </div>
            )}

            {usuario.cidade && (
              <div className="field">
                <label>Cidade</label>
                <input disabled value={usuario.cidade} placeholder="Cidade" />
              </div>
            )}

            {usuario.bairro && (
              <div className="field">
                <label>Bairro</label>
                <input disabled value={usuario.bairro} placeholder="Bairro" />
              </div>
            )}

            {usuario.numero && (
              <div className="field">
                <label>Número</label>
                <input disabled value={usuario.numero} placeholder="Número" />
              </div>
            )}

            {usuario.telefone && (
              <div className="field">
                <label>Telefone</label>
                <input disabled value={usuario.telefone} placeholder="Telefone" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Atualização */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Atualizar Cadastro do Usuário</h2>
              <button className="btn-fechar" onClick={fecharModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label>Nome</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Nome"
                />
              </div>

              <div className="field">
                <label>Sobrenome</label>
                <input
                  name="sobrenome"
                  value={form.sobrenome}
                  onChange={handleChange}
                  placeholder="Sobrenome"
                />
              </div>

              <div className="field">
                <label>Cidade</label>
                <input
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder="Cidade"
                />
              </div>

              <div className="field">
                <label>Bairro</label>
                <input
                  name="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  placeholder="Bairro"
                />
              </div>

              <div className="field">
                <label>Número</label>
                <input
                  name="numero"
                  value={form.numero}
                  onChange={handleChange}
                  placeholder="Número"
                />
              </div>

              <div className="field">
                <label>Telefone</label>
                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="Telefone"
                />
              </div>

              {erro && <div className="erro-geral">{erro}</div>}
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancelar"
                onClick={fecharModal}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                className="btn-salvar"
                onClick={handleSalvar}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
