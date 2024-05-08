import { useState } from 'react'
import './App.css'
import './index.css'
import InpostLogo from '/logo.svg'

function App() {
  const [data, setData] = useState('')
  const [number, setNumber] = useState('')

  const statusNames = {
    "adopted_at_source_branch": { 
      name: "Przyjęta w oddziale InPost", 
      description: "Twoja paczka dotarła do jednego z naszych centrów logistycznych, skąd wkrótce wyruszy w dalszą drogę." 
    },
    "collected_from_sender": { 
      name: "Odebrana od klienta", 
      description: "Kurier odebrał paczkę od Nadawcy i przekazuje ją do oddziału InPost." 
    },
    "confirmed": { 
      name: "Przygotowana przez Nadawcę", 
      description: "Paczka wkrótce zostanie przekazana w nasze ręce, by trafić do Ciebie jak najszybciej." 
    },
    // Dodaj więcej statusów według potrzeb
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api-shipx-pl.easypack24.net/v1/tracking/${number}`, {
        headers: {
          'Origin': 'https://inpost.pl',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      
      if (!response.ok) {
        console.error('Server response was not ok.');
        return;
      }
    
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setData(JSON.stringify(data, null, 2));
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  return (
    <>
      <img className='logo' src={InpostLogo}/><br />
      <h1>Śledzenie paczek</h1>
      <code>523000016243392090814635</code> {/* Numer przesyłki na czas testów.*/}
      <div className="card">
        <input maxLength={24} type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Wpisz numer paczki..." />
        <br />
        <button className={`full ${number.length !== 24 && number.length !== 0 ? "error" : ""}`} onClick={fetchData} disabled={number.length !== 24 && number.length !== 0}>
          {number.length !== 24 && number.length !== 0 ? "Nieprawidłowy numer paczki." : "Namierz paczkę!"}
        </button>
        <br />
        {data && (
          <div>
            {JSON.parse(data).tracking_details.map((detail, index) => (
              <div key={index} className="tracking-step">
                <div className='status'>{statusNames[detail.status].name}
                <div className="inside"><div>{statusNames[detail.status].description}</div>
                <hr />
                <div>{new Date(detail.datetime).toLocaleString()}</div>
                </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
      <footer>
      <a href="https://inpost.pl/sledzenie-przesylek">Strona oficjalna</a>
      </footer>
    </>
  )
}

export default App