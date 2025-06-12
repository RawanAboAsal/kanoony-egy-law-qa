// import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
// import Navbar from './components/Navbar';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
import Home from './pages/Home';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-secondary">
          {/* <Navbar /> */}
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} /> */}
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;