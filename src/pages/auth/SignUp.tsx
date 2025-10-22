import { Link } from "react-router-dom";
import "./styles.scss";
import { SignUpVector } from "../../assets/svg/SignUpVector";

export default function SignUp() {
  return (
    <main className="login">
      <div className="main-container">
        <div className="left-content">
          <h2>Cadastrar em TrackPet</h2>
          <div className="field">
            <label>E-mail</label>
            <input type="email" placeholder="exemplo@email.com"></input>
          </div>
          <div className="field">
            <label>Nome</label>
            <input placeholder="Digite seu nome"></input>
          </div>
          <div className="field">
            <label>Senha</label>
            <input type="password" placeholder="Digite sua senha"></input>
          </div>
          <div className="field">
            <input type="password" placeholder="Confirme sua senha"></input>
          </div>
          <Link to={"/painel"}>
            <button>Cadastrar</button>
          </Link>

          <span>
            Já tem conta? <Link to={"/"}>Faça login</Link>
          </span>
        </div>
        <div className="right-content">
          <SignUpVector />
        </div>
      </div>
    </main>
  );
}
