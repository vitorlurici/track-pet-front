import { Link } from "react-router-dom";
import { LoginVector } from "../../assets/svg/LoginVector";
import "./styles.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, setToken } from "../services/authService";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, senha });

      if (data.authenticated) {
        // Armazena o token com horário (controle expiração)
        setToken(data.token);
        localStorage.setItem("email", data.email);
        // Redireciona pro painel
        navigate("/painel");
      } else {
        setError("Falha na autenticação");
      }
    } catch (err: any) {
      setError("Erro ao conectar-se ao servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main-container">
      <div className="left-content">
        <h2>Entrar em TrackPet</h2>

        <div className="field">
          <label>E-mail</label>
          <input
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <p className="error">{error}</p>}

        <span>
          Não tem conta? <Link to="/cadastro">Faça seu cadastro</Link>
        </span>
      </div>

      <div className="right-content">
        <LoginVector />
      </div>
    </main>
  );
}