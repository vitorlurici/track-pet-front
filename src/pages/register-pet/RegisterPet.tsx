import { Link } from "react-router-dom";
import "./RegisterPet.scss";
export default function RegisterPet() {
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

          <button>Cadastrar Pet</button>
        </div>
      </div>
    </main>
  );
}
