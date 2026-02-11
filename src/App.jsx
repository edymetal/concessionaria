import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';
import VehicleDetail from './pages/VehicleDetail';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="vehicle/:id" element={<VehicleDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
