
import { ExitIcon } from "../../assets/svg/ExitIcon";
import { MoreIcon } from "../../assets/svg/MoreIcon";
import "./Dashboard.scss";
import { ProfileIcon } from "../../assets/svg/ProfileIcon";
import  { getUsuario } from "../services/usuarioService";
import { getAnimais } from "../services/animalService";
import { useEffect, useState } from "react";
import type { Animal } from "../types/animal";
import { Link, useNavigate } from "react-router-dom";
import { removeToken, getTokenData } from "../services/authService";

export default function Dashboard() {
  const API_URL = "http://localhost:8080";//alterar para variavel global
  const [nome, setNome] = useState<string>("");
  const [animais, setAnimais] = useState<Animal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca o usuário autenticado
        const usuario = await getUsuario();
        setNome(usuario.nome);

        // Busca os pets do usuário
        const lista = await getAnimais();
        setAnimais(lista);
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        navigate("/");
      }
    }

    carregarDados();
  }, [navigate]);

  useEffect(() => {
    // Checa expiração do token a cada minuto
    const timer = setInterval(() => {
      const { time } = getTokenData();
      if (time && Date.now() - time > 2 * 60 * 60 * 1000) { // 2 horas
        removeToken();
        navigate("/");
      }
    }, 60 * 1000); // cada minuto
    return () => clearInterval(timer);
  }, [navigate]);

  function handleLogout() {
    removeToken();
    navigate("/");
  }

  return (
    <main className="dashboard">
      <div className="top">
        <div className="profile">
          <Link to={"/perfil"}>
            <button>
              <ProfileIcon />
            </button>
          </Link>
          <h2>Olá, {nome || "Usuário"}!</h2>
        </div>

        <button onClick={handleLogout}>
          <ExitIcon />
          Sair
        </button>
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
          {animais.length > 0 ? (
            animais.map((pet) => (
              <Link to={`/pet/${pet.id}`} key={pet.id}>
                <div className="pet-content">
                  <div
                    className="image"
                    style={{
                      backgroundImage: `url(${API_URL}${pet.fotoUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  {pet.nome}
                  
                </div>
              </Link>
            ))
          ) : (
            <p>Nenhum pet cadastrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}