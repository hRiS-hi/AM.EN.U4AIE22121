import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/numbers';

const App = () => {
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const fetchNumbers = async (numberId) => {
    if (!numberId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/${numberId}`, {
        headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDU1MTgxLCJpYXQiOjE3NDcwNTQ4ODEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImUzZmFiZDEyLTVkMjItNGUxMC04Y2ZmLTMyZTdiZDRiNWJjZiIsInN1YiI6ImFtLmVuLnU0YWllMjIxMjFAYW0uc3R1ZGVudHMuYW1yaXRhLmVkdSJ9LCJlbWFpbCI6ImFtLmVuLnU0YWllMjIxMjFAYW0uc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJocmlzaGVla2VzaCBnIG5haXIiLCJyb2xsTm8iOiJhbS5lbi51NGFpZTIyMTIxIiwiYWNjZXNzQ29kZSI6IlN3dXVLRSIsImNsaWVudElEIjoiZTNmYWJkMTItNWQyMi00ZTEwLThjZmYtMzJlN2JkNGI1YmNmIiwiY2xpZW50U2VjcmV0IjoiZkdxRVZEZ0tYZ1NwdVZ1SiJ9.ePpzJZmXvpVoh-w9C0XUoguXs7brfJhT5_4gT7WhUAU',
          'Accept': 'application/json',
        }
      });

      const data = response.data;
      setWindowPrevState(data.windowPrevState || []);
      setWindowCurrState(data.windowCurrState || []);
      setNumbers(data.numbers || []);
      setAvg(data.avg || 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch numbers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberTypeChange = (event) => {
    const numberId = event.target.value;
    setSelectedType(numberId);
    fetchNumbers(numberId);
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div>
        <select value={selectedType} onChange={handleNumberTypeChange}>
          <option value="">Select a number type</option>
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="e">Even</option>
          <option value="r">Random</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Window State (Before the Latest API Call)</h2>
        <p>{windowPrevState.length ? windowPrevState.join(', ') : 'No data'}</p>
      </div>

      <div>
        <h2>Window State (After the Latest API Call)</h2>
        <p>{windowCurrState.length ? windowCurrState.join(', ') : 'No data'}</p>
      </div>

      <div>
        <h2>Fetched Numbers</h2>
        <p>{numbers.length ? numbers.join(', ') : 'No data'}</p>
      </div>

      <div>
        <h2>Average</h2>
        <p>{avg !== null ? avg : 'N/A'}</p>
      </div>
    </div>
  );
};

export default App;