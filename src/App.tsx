import "./App.css";

function App() {
  return (
    <main className="login">
      <div className="header">
        <div className="logo">Track Pet</div>
      </div>

      <div className="main-container">
        <h2>Entrar</h2>
        <div className="left-content">
          <div className="email">
            <label>E-mail</label>
            <input type="email" placeholder="Digite seu e-mail"></input>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
