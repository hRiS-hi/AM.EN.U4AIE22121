import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let numberWindow = [];
const WINDOW_SIZE = 10;

const calculateAverage = (numbers) => {
  if (!numbers.length) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;
  
  let apiUrl = '';
  switch (numberId) {
    case 'p': apiUrl = 'http://20.244.56.144/evaluation-service/primes'; break;
    case 'f': apiUrl = 'http://20.244.56.144/evaluation-service/fibo'; break;
    case 'e': apiUrl = 'http://20.244.56.144/evaluation-service/even'; break;
    case 'r': apiUrl = 'http://20.244.56.144/evaluation-service/rand'; break;
    default: return res.status(400).send({ error: 'Invalid number type' });
  }

  try {
    const response = await axios.get(apiUrl, { timeout: 500 });
    const newNumbers = response.data.numbers || [];
    
    
    const previousWindow = [...numberWindow];
    
 
    const uniqueNewNumbers = newNumbers.filter(num => !numberWindow.includes(num));
    
  
    numberWindow = [...numberWindow, ...uniqueNewNumbers];
    if (numberWindow.length > WINDOW_SIZE) {
      numberWindow = numberWindow.slice(-WINDOW_SIZE);
    }
    
    const avg = calculateAverage(numberWindow);
    
    res.json({
      windowPrevState: previousWindow,
      windowCurrState: numberWindow,
      numbers: uniqueNewNumbers,
      avg: avg
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ 
      error: 'Failed to fetch numbers from the test server',
      details: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('Average Calculator Microservice is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});