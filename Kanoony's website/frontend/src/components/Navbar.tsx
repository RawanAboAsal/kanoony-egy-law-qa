import React from 'react';
import { Link } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();

  const translations = {
    en: {
      login: 'Login',
      signup: 'Sign Up',
      brand: 'Kanoony'
    },
    ar: {
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      brand: 'قانوني'
    }
  };

  const t = translations[language];

  return (
    <nav className="bg-primary text-white rounded-b-3xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/src/components/Logo.png" alt="Logo" className="h-16 w-16" />
            <span className="text-2xl font-bold text-secondary">{t.brand}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-primary-light rounded-full transition-colors"
              aria-label="Toggle language"
            >
              <Languages className="h-5 w-5 text-secondary" />
            </button>
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-md hover:bg-primary-light transition-colors"
            >
              {t.login}
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-secondary text-primary rounded-md hover:bg-secondary-dark transition-colors"
            >
              {t.signup}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;