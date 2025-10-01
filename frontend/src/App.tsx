
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './Web3Context';
import Home from './Home';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;