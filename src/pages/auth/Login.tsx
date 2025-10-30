import { Link } from "react-router-dom";
import { LoginVector } from "../../assets/svg/LoginVector";
import "./styles.scss";

export default function Login() {
  return (
    <main className="main-container">
      <div className="left-content">
        <h2>Entrar em TrackPet</h2>
        <div className="field">
          <label>E-mail</label>
          <input type="email" placeholder="exemplo@email.com"></input>
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha"></input>
        </div>
        <Link to={"/painel"}>
          <button>Entrar</button>
        </Link>

        <span>
          Não tem conta? <Link to={"/cadastro"}>Faça seu cadastro</Link>
        </span>
      </div>
      <div className="right-content">
        <LoginVector />
      </div>
    </main>
  );
}
