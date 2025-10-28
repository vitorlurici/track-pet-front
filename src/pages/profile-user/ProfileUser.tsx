import { Link } from "react-router-dom";
import "./ProfileUser.scss";

export default function ProfileUser() {
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
          <div className="field">
            <label>Nome</label>
            <input placeholder="Nome"></input>
          </div>
          <div className="field">
            <label>Idade</label>
            <input placeholder="Idade"></input>
          </div>
          <div className="field">
            <label>Endereço</label>
            <input placeholder="Endereço"></input>
          </div>
          <div className="field">
            <label>Telefone</label>
            <input placeholder="Telefone"></input>
          </div>

          <button>Atualizar cadastro</button>
        </div>
      </div>
    </main>
  );
}
