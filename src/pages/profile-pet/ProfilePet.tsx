import { Link } from "react-router-dom";
import "./ProfilePet.scss";
import { QrCodeExample } from "../../assets/svg/QrCodeExample";

export default function ProfilePet() {
  return (
    <main className="profile-main">
      <div className="top">
        <div className="left">
          <Link to={"/painel"}>
            <button>Voltar</button>
          </Link>
        </div>
        <div className="right">
          <h2>Nome do Pet</h2>
        </div>
      </div>
      <div className="content-container">
        <div className="left-container">
          <div className="picture">
            <QrCodeExample />
          </div>
          <button>Baixar QrCode</button>
        </div>
        <div className="right-container">
          <button>Atualizar cadastro</button>
          <div className="field">
            <label>Nome</label>
            <input disabled placeholder="Nome"></input>
          </div>
          <div className="field">
            <label>Idade</label>
            <input disabled placeholder="Idade"></input>
          </div>
          <div className="field">
            <label>Ultima localização</label>
            <input disabled placeholder="Endereço"></input>
          </div>
        </div>
      </div>
    </main>
  );
}
