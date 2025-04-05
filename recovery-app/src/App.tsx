import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/home';
import Recovery from './pages/recovery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recovery" element={<Recovery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
