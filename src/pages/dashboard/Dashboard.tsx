import { Link } from "react-router-dom";
import { ExitIcon } from "../../assets/svg/ExitIcon";
import { MoreIcon } from "../../assets/svg/MoreIcon";
import "./Dashboard.scss";
import { ProfileIcon } from "../../assets/svg/ProfileIcon";

export default function Dashboard() {
  return (
    <main className="dashboard">
      <div className="top">
        <div className="profile">
          <Link to={"/perfil"}>
            <button>
              <ProfileIcon />
            </button>
          </Link>
          <h2>Olá, nome</h2>
        </div>
        <Link to={"/"}>
          <button>
            <ExitIcon />
            Sair
          </button>
        </Link>
      </div>
      <div className="content-container">
        <Link to={"/cadastrar-pet"}>
          <button>
            <MoreIcon />
            Cadastrar Pet
          </button>
        </Link>
        <p>Pets cadastrados</p>
        <div className="pet-container">
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
          <Link to={"/pet"}>
            <div className="pet-content">
              <div className="image"></div>Nome
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
