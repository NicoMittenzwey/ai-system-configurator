import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ITAdmin from './components/ITAdmin';
import Configurator from './components/Configurator';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<ITAdmin />} />
        <Route path="/configurator" element={<Configurator />} />
      </Routes>
    </Router>
  )
}

export default App
