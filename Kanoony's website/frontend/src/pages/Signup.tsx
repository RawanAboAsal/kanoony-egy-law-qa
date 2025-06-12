import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { language } = useLanguage();

  const translations = {
    en: {
      createAccount: 'Create an Account',
      fullName: 'Full Name',
      namePlaceholder: 'Enter your full name',
      email: 'Email Address',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Choose a strong password',
      signUp: 'Create Account',
      haveAccount: 'Already have an account?',
      signInHere: 'Sign in here'
    },
    ar: {
      createAccount: 'إنشاء حساب',
      fullName: 'الاسم الكامل',
      namePlaceholder: 'أدخل اسمك الكامل',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      password: 'كلمة المرور',
      passwordPlaceholder: 'اختر كلمة مرور قوية',
      signUp: 'إنشاء حساب',
      haveAccount: 'لديك حساب بالفعل؟',
      signInHere: 'سجل دخولك هنا'
    }
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase authentication
    console.log('Signup:', { name, email, password });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-16">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t.createAccount}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.fullName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder={t.namePlaceholder}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.email}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder={t.emailPlaceholder}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.password}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder={t.passwordPlaceholder}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light transition-colors"
          >
            {t.signUp}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {t.haveAccount}{' '}
          <Link to="/login" className="text-primary hover:underline">
            {t.signInHere}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;