import { useState } from 'react';
import './App.css'; // Arquivo CSS para customização de estilos

function App() {
  const [city, setCity] = useState("Belo Horizonte");
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // Estado de loading
  const [error, setError] = useState(null);  // Estado para erros

  const handleChange = (e) => {
    setCity(e.target.value);
  }

  const handleSearch = () => {
    setIsLoading(true);  // Inicia o loading
    setError(null);  // Reseta o erro
    fetch(`http://api.weatherapi.com/v1/current.json?key=6e55e718cef64d068e8201446241408&q=${city}&lang=pt`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Erro na requisição: ' + response.status);
        }
      })
      .then((data) => {
        setWeatherForecast(data);
        setIsLoading(false);  // Finaliza o loading
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
        setError(error.message);  // Define o erro
        setIsLoading(false);  // Finaliza o loading em caso de erro
      });
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-4">
        <a className="navbar-brand text-white" href="#top">
          Previsão do Tempo
        </a>
      </nav>

      <main className="container">
        <div className="jumbotron bg-light p-4 shadow rounded">
          <h1 className="display-4 text-primary">
            Verifique a previsão do tempo
          </h1>
          <p className='lead text-secondary'>
            Insira o nome da sua cidade no campo abaixo
          </p>
          <div className="input-group mb-4">
            <input
              onChange={handleChange}
              className="form-control form-control-lg"
              placeholder="Digite sua cidade"
              value={city}
              disabled={isLoading}  // Desabilitar input durante o loading
            />
            <div className="input-group-append">
              <button
                onClick={handleSearch}
                className="btn btn-primary btn-lg"
                disabled={isLoading}  // Desabilitar botão durante o loading
              >
                {isLoading ? 'Pesquisando...' : 'Pesquisar'}  {/* Mostra 'Pesquisando...' quando estiver carregando */}
              </button>
            </div>
          </div>

          {/* Exibir erro, se houver */}
          {error && (
            <div className="alert alert-danger mt-4">
              {error}
            </div>
          )}

          {/* Exibir loading spinner */}
          {isLoading && (
            <div className="spinner-border text-primary mt-4" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {/* Exibir a previsão do tempo */}
          {weatherForecast && !isLoading && (
            <div className="weather-result bg-white p-4 rounded shadow mt-4">
              <div className="d-flex align-items-center">
                <div className="mr-4">
                  <img src={weatherForecast.current.condition.icon} alt="Ícone do clima" />
                </div>

                <div>
                  <h3 className="text-info">Hoje o dia está: {weatherForecast.current.condition.text} </h3>
                  <p className='lead'>
                    Temperatura: {weatherForecast.current.temp_c}°C
                  </p>
                  <p className='lead'>
                    Sensação térmica: {weatherForecast.current.feelslike_c}°C
                  </p>
                  <p className='text-muted'>
                    Umidade: {weatherForecast.current.humidity}% | Vento: {weatherForecast.current.wind_kph} km/h
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
