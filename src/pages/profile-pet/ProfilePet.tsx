import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProfilePet.scss";
import { getAnimalById, updateAnimal, getLeiturasByAnimalId } from "../services/animalService";
import type { Animal } from "../types/animal";
import type { Leitura } from "../types/leitura";
import type { ChangeEvent } from "react";
import { QRCodeSVG } from "qrcode.react";

const API_URL = "http://localhost:8080"; // alterar para variável global
const FRONTEND_URL = window.location.origin; // URL do frontend

export default function ProfilePet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalQrAberto, setModalQrAberto] = useState(false);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroValidacao, setErroValidacao] = useState("");
  const [qrTamanho, setQrTamanho] = useState({ largura: 2, altura: 4 }); // em cm
  const [qrSize, setQrSize] = useState(256); // tamanho do QR code em pixels

  const [form, setForm] = useState({
    nome: "",
    peso: "",
    raca: "",
    sexo: "",
    cor: "",
    dataNascimento: "",
  });

  useEffect(() => {
    if (!id) {
      navigate("/painel");
      return;
    }

    async function carregarDados() {
      setLoading(true);
      setErro("");
      try {
        const [animalData, leiturasData] = await Promise.all([
          getAnimalById(id),
          getLeiturasByAnimalId(id),
        ]);

        setAnimal(animalData);
        setLeituras(leiturasData);

        // Preenche o formulário com os dados do animal
        setForm({
          nome: animalData.nome || "",
          peso: animalData.peso?.toString() || "",
          raca: animalData.raca || "",
          sexo: animalData.sexo || "",
          cor: animalData.cor || "",
          dataNascimento: animalData.dataNascimento || "",
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          setErro("Pet não encontrado.");
        } else {
          setErro("Erro ao carregar dados do pet.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id, navigate]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpa erro de validação quando o usuário começa a digitar
    if (name === "sexo" && erroValidacao) {
      setErroValidacao("");
    }
  }

  function formatarSexo(sexo: string): string {
    if (!sexo) return "";
    const sexoUpper = sexo.toUpperCase();
    if (sexoUpper === "M" || sexoUpper === "MACHO" || sexoUpper === "MALE") {
      return "Macho";
    }
    if (sexoUpper === "F" || sexoUpper === "FEMEA" || sexoUpper === "FEMEA" || sexoUpper === "FEMALE") {
      return "Fêmea";
    }
    return sexo;
  }

  function calcularIdade(dataNascimento: string | null): string {
    if (!dataNascimento) return "";
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const anos = hoje.getFullYear() - nascimento.getFullYear();
    const meses = hoje.getMonth() - nascimento.getMonth();
    
    if (anos === 0) {
      return `${meses} ${meses === 1 ? "mês" : "meses"}`;
    }
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }

  function formatarData(data: string | null): string {
    if (!data) return "";
    try {
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  }

  function formatarDataHora(dataHora: string): string {
    if (!dataHora) return "";
    try {
      const date = new Date(dataHora);
      return date.toLocaleString("pt-BR");
    } catch {
      return dataHora;
    }
  }

  // Converte o sexo da API para o formato do formulário (M ou F)
  function converterSexoParaFormulario(sexo: string): string {
    if (!sexo) return "";
    const sexoUpper = sexo.toUpperCase().trim();
    // Aceita M, MACHO ou qualquer variação que comece com M
    if (sexoUpper === "M" || sexoUpper === "MACHO" || sexoUpper.startsWith("M")) return "M";
    // Aceita F, FEMEA ou qualquer variação que comece com F
    if (sexoUpper === "F" || sexoUpper === "FEMEA" || sexoUpper.startsWith("F")) return "F";
    return "";
  }

  // Converte o sexo do formulário para o formato da API (apenas M ou F)
  function converterSexoParaAPI(sexo: string): string {
    if (!sexo) return "";
    const sexoUpper = sexo.toUpperCase().trim();
    // Garante que retorna exatamente "M" ou "F"
    if (sexoUpper === "M" || sexoUpper === "MACHO" || sexoUpper.startsWith("M")) return "M";
    if (sexoUpper === "F" || sexoUpper === "FEMEA" || sexoUpper.startsWith("F")) return "F";
    // Se não reconhecer, retorna vazio (será validado antes de enviar)
    return "";
  }

  function abrirModal() {
    if (!animal) return;
    // Preenche o formulário com os dados atuais ao abrir o modal
    // Converte o sexo de "FEMEA"/"MACHO" para "F"/"M"
    setForm({
      nome: animal.nome || "",
      peso: animal.peso?.toString() || "",
      raca: animal.raca || "",
      sexo: converterSexoParaFormulario(animal.sexo),
      cor: animal.cor || "",
      dataNascimento: animal.dataNascimento || "",
    });
    setErroValidacao("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setErroValidacao("");
  }

  async function handleSalvar() {
    if (!id || !animal) return;

    // Validação obrigatória do campo sexo
    if (!form.sexo) {
      setErroValidacao("O campo sexo é obrigatório!");
      return;
    }

    // Converte e valida o sexo antes de enviar
    const sexoConvertido = converterSexoParaAPI(form.sexo);
    if (sexoConvertido !== "M" && sexoConvertido !== "F") {
      setErroValidacao("O campo sexo deve ser M (Macho) ou F (Fêmea)!");
      return;
    }

    setSalvando(true);
    setErroValidacao("");
    setErro("");

    try {
      // Converte a situação para o formato que a API espera: "VIVO" -> "V"
      let situacaoParaEnviar = "V"; // Valor padrão
      if (animal.situacao && typeof animal.situacao === 'string') {
        const situacaoUpper = animal.situacao.toUpperCase().trim();
        // Converte "VIVO" para "V", mantém "V" se já for
        if (situacaoUpper === "VIVO" || situacaoUpper === "V") {
          situacaoParaEnviar = "V";
        } else {
          situacaoParaEnviar = situacaoUpper; // Mantém outros valores se houver
        }
      }
      
      // Trata dataNascimento: se vazio ou null, envia null
      const dataNascimentoValue = form.dataNascimento && form.dataNascimento.trim() !== "" 
        ? form.dataNascimento 
        : null;
      
      const dadosAtualizados = {
        nome: form.nome.trim(),
        dataNascimento: dataNascimentoValue,
        peso: parseFloat(form.peso),
        situacao: situacaoParaEnviar, // Sempre envia "V" (converte "VIVO" para "V")
        raca: form.raca.trim(),
        sexo: sexoConvertido, // Garante que é exatamente "M" ou "F"
        cor: form.cor.trim(),
      };

      const animalAtualizado = await updateAnimal(id, dadosAtualizados);
      setAnimal(animalAtualizado);
      setModalAberto(false);
      alert("Dados atualizados com sucesso!");
      
      // Atualiza os detalhes se estiverem visíveis
      if (detalhesVisiveis) {
        setForm({
          nome: animalAtualizado.nome || "",
          peso: animalAtualizado.peso?.toString() || "",
          raca: animalAtualizado.raca || "",
          sexo: converterSexoParaFormulario(animalAtualizado.sexo),
          cor: animalAtualizado.cor || "",
          dataNascimento: animalAtualizado.dataNascimento || "",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const mensagemErro = error.response?.data?.message || error.response?.data?.error || "Dados inválidos. Verifique os campos preenchidos.";
        setErro(`Erro: ${mensagemErro}`);
      } else {
        setErro("Erro ao atualizar dados do pet. Tente novamente.");
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

  if (erro && !animal) {
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

  if (!animal) return null;

  const fotoUrl = animal.fotoUrl ? `${API_URL}${animal.fotoUrl}` : null;

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

        <div className="pet-header">
          <div className="pet-image-container">
            <div
              className="pet-image"
              style={{
                backgroundImage: fotoUrl ? `url(${fotoUrl})` : "none",
                backgroundColor: fotoUrl ? "transparent" : "#ccc",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          <h1 className="pet-name">Pet {animal.nome}</h1>
          <div className="pet-actions">
            <button onClick={() => setDetalhesVisiveis(!detalhesVisiveis)} className="btn-detalhes">
              {detalhesVisiveis ? "Ocultar detalhes" : "Ver detalhes"}
            </button>
            <button onClick={abrirModal} className="btn-atualizar">
              Atualizar
            </button>
            <button onClick={() => setModalQrAberto(true)} className="btn-qrcode">
              QR Code
            </button>
          </div>
        </div>

        {/* Seção de Detalhes (oculta por padrão) */}
        {detalhesVisiveis && (
          <div className="detalhes-container">
            {animal.nome && (
              <div className="field">
                <label>Nome</label>
                <input disabled value={animal.nome} placeholder="Nome" />
              </div>
            )}

            {animal.dataNascimento && (
              <>
                <div className="field">
                  <label>Idade</label>
                  <input
                    disabled
                    value={calcularIdade(animal.dataNascimento)}
                    placeholder="Idade"
                  />
                </div>

                <div className="field">
                  <label>Data de Nascimento</label>
                  <input
                    disabled
                    value={formatarData(animal.dataNascimento)}
                    placeholder="Data de Nascimento"
                  />
                </div>
              </>
            )}

            {animal.peso != null && (
              <div className="field">
                <label>Peso (kg)</label>
                <input disabled value={animal.peso} placeholder="Peso" />
              </div>
            )}

            {animal.raca && (
              <div className="field">
                <label>Raça</label>
                <input disabled value={animal.raca} placeholder="Raça" />
              </div>
            )}

            {animal.sexo && (
              <div className="field">
                <label>Sexo</label>
                <input
                  disabled
                  value={formatarSexo(animal.sexo)}
                  placeholder="Sexo"
                />
              </div>
            )}

            {animal.cor && (
              <div className="field">
                <label>Cor</label>
                <input disabled value={animal.cor} placeholder="Cor" />
              </div>
            )}

            {animal.situacao && (
              <div className="field">
                <label>Situação</label>
                <input disabled value={animal.situacao} placeholder="Situação" />
              </div>
            )}
          </div>
        )}

        {/* Seção de Scaneamentos */}
        <div className="scaneamentos-section">
          <h3>Histórico de Scaneamentos</h3>
          {leituras.length > 0 ? (
            <div className="leituras-grid">
              {leituras.map((leitura) => (
                <div 
                  key={leitura.id} 
                  className="leitura-card"
                  onClick={() => navigate(`/rastreamento/${leitura.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <p className="leitura-data">
                    <strong>Data/Hora:</strong> {formatarDataHora(leitura.dataHora)}
                  </p>
                  <p className="leitura-localizacao">
                    <strong>Localização:</strong> {leitura.latitude}, {leitura.longitude}
                  </p>
                  {leitura.endereco && (
                    <p className="leitura-endereco">
                      <strong>Endereço:</strong> {leitura.endereco}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="sem-leituras">Nenhum scaneamento registrado ainda.</p>
          )}
        </div>
      </main>

      {/* Modal de Atualização */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Atualizar Cadastro do Pet</h2>
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
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  placeholder="Peso"
                />
              </div>

              <div className="field">
                <label>Raça</label>
                <input
                  name="raca"
                  value={form.raca}
                  onChange={handleChange}
                  placeholder="Raça"
                />
              </div>

              <div className="field">
                <label>Sexo <span className="required">*</span></label>
                <select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  className={erroValidacao ? "error" : ""}
                >
                  <option value="">Selecione</option>
                  <option value="M">Macho</option>
                  <option value="F">Fêmea</option>
                </select>
                {erroValidacao && (
                  <span className="error-message">{erroValidacao}</span>
                )}
              </div>

              <div className="field">
                <label>Cor</label>
                <input
                  name="cor"
                  value={form.cor}
                  onChange={handleChange}
                  placeholder="Cor"
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

      {/* Modal de QR Code */}
      {modalQrAberto && animal && (
        <div className="modal-overlay" onClick={() => setModalQrAberto(false)}>
          <div className="modal-content modal-qrcode" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>QR Code - {animal.nome}</h2>
              <button className="btn-fechar" onClick={() => setModalQrAberto(false)}>
                ×
              </button>
            </div>

            <div className="modal-body qrcode-body">
              <p className="qrcode-description">
                Escaneie este QR code para informar sobre o encontro do pet
              </p>
              
              <div className="qrcode-size-selector">
                <label htmlFor="tamanho-qr">Tamanho para impressão:</label>
                <select
                  id="tamanho-qr"
                  value={`${qrTamanho.largura}x${qrTamanho.altura}`}
                  onChange={(e) => {
                    const [largura, altura] = e.target.value.split('x').map(Number);
                    setQrTamanho({ largura, altura });
                    // Converte cm para pixels (1cm ≈ 37.8 pixels na impressão)
                    const pixelsPorCm = 37.8;
                    setQrSize(Math.min(largura, altura) * pixelsPorCm);
                  }}
                  className="select-tamanho"
                >
                  <option value="2x2">2 x 2 cm</option>
                  <option value="2x4">2 x 4 cm</option>
                  <option value="3x3">3 x 3 cm</option>
                  <option value="4x4">4 x 4 cm</option>
                  <option value="5x5">5 x 5 cm</option>
                  <option value="6x6">6 x 6 cm</option>
                  <option value="4x6">4 x 6 cm</option>
                  <option value="6x8">6 x 8 cm</option>
                </select>
              </div>

              <div className="qrcode-container" id="qrcode-print">
                <QRCodeSVG
                  value={`${FRONTEND_URL}/informar-encontro/${animal.id}`}
                  size={qrSize}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="qrcode-url">
                <p className="url-label">URL:</p>
                <p className="url-value">{FRONTEND_URL}/informar-encontro/{animal.id}</p>
              </div>

              <div className="qrcode-actions">
                <button
                  className="btn-download-qr"
                  onClick={() => {
                    const qrContainer = document.querySelector('.qrcode-container');
                    const svg = qrContainer?.querySelector('svg');
                    if (!svg) return;

                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      if (ctx) {
                        ctx.drawImage(img, 0, 0);
                      }
                      const pngFile = canvas.toDataURL('image/png');
                      
                      const downloadLink = document.createElement('a');
                      downloadLink.download = `QRCode-${animal.nome.replace(/\s+/g, '_')}-${animal.id}.png`;
                      downloadLink.href = pngFile;
                      downloadLink.click();
                    };

                    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                  }}
                >
                  Baixar QR Code
                </button>

                <button
                  className="btn-print-qr"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (!printWindow) return;

                    const qrContainer = document.getElementById('qrcode-print');
                    const svg = qrContainer?.querySelector('svg');
                    if (!svg) return;

                    // Calcula dimensões em pixels para impressão (1cm = 37.8px)
                    const pixelsPorCm = 37.8;
                    const larguraPx = qrTamanho.largura * pixelsPorCm;
                    const alturaPx = qrTamanho.altura * pixelsPorCm;

                    const svgData = new XMLSerializer().serializeToString(svg);
                    const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>QR Code - ${animal.nome}</title>
                          <style>
                            @media print {
                              @page {
                                size: ${qrTamanho.largura}cm ${qrTamanho.altura}cm;
                                margin: 0;
                              }
                              body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                width: ${qrTamanho.largura}cm;
                                height: ${qrTamanho.altura}cm;
                              }
                            }
                            body {
                              margin: 0;
                              padding: 0.2cm;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                              width: ${qrTamanho.largura}cm;
                              height: ${qrTamanho.altura}cm;
                              font-family: Arial, sans-serif;
                              box-sizing: border-box;
                            }
                            .qrcode-wrapper {
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                              width: 100%;
                              height: 100%;
                              gap: 0.3cm;
                            }
                            img {
                              max-width: 80%;
                              max-height: 60%;
                              object-fit: contain;
                            }
                            .pet-info {
                              text-align: center;
                              font-size: 0.35cm;
                              line-height: 1.3;
                              font-weight: bold;
                              color: #000;
                              margin-top: 0.2cm;
                            }
                            .pet-nome {
                              display: block;
                              margin-bottom: 0.1cm;
                            }
                            .pet-raca {
                              display: block;
                              font-weight: normal;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="qrcode-wrapper">
                            <img src="${svgBase64}" alt="QR Code - ${animal.nome}" />
                            <div class="pet-info">
                              <span class="pet-nome">${animal.nome}</span>
                              ${animal.raca ? `<span class="pet-raca">- ${animal.raca}</span>` : ''}
                            </div>
                          </div>
                          <script>
                            window.onload = function() {
                              window.print();
                              window.onafterprint = function() {
                                window.close();
                              };
                            };
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }}
                >
                  Imprimir QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
