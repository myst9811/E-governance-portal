
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './Web3Context';
import { ThemeProvider } from './ThemeContext';
import Home from './Home';
import Identity from './pages/Identity';
import Certificates from './pages/Certificates';
import Voting from './pages/Voting';
import ServiceRequests from './pages/ServiceRequests';
import Admin from './pages/Admin';

function App() {
  return (
    <ThemeProvider>
      <Web3Provider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/identity" element={<Identity />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/voting" element={<Voting />} />
            <Route path="/services" element={<ServiceRequests />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;