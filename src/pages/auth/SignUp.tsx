import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";
import { SignUpVector } from "../../assets/svg/SignUpVector";
import { useState } from "react";
import { registrarUsuario } from "../services/authService";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem!");
      return;
    }

    if (!form.nome || !form.email || !form.senha) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    setErro(null);
    setLoading(true);

    try {
      await registrarUsuario({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });

      alert("Usuário registrado com sucesso!");
      navigate("/"); // redireciona para tela de login
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="left-content">
        <h2>Cadastrar em TrackPet</h2>

        <div className="field">
          <label>Nome</label>
          <input
            name="nome"
            placeholder="Digite seu nome"
            value={form.nome}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="exemplo@email.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Senha</label>
          <input
            type="password"
            name="senha"
            placeholder="Digite sua senha"
            value={form.senha}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirme sua senha"
            value={form.confirmarSenha}
            onChange={handleChange}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        {erro && <p style={{ color: "red", marginTop: "8px" }}>{erro}</p>}

        <span>
          Já tem conta? <Link to={"/"}>Faça login</Link>
        </span>
      </div>

      <div className="right-content">
        <SignUpVector />
      </div>
    </main>
  );
}