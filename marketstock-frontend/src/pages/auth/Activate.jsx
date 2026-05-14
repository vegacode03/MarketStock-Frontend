import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sellerApi } from '../../api/seller';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/index';
import { MessageSquare } from 'lucide-react';

export default function Activate() {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [shakeError, setShakeError] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToast();
  const inputRefs = useRef([]);
  const phone = sessionStorage.getItem('ms_pending_phone') || '';

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => setResendCooldown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4).split('');
    const newCode = [...code];
    pasteData.forEach((char, i) => {
      if (/^\d$/.test(char)) newCode[i] = char;
    });
    setCode(newCode);
    if (pasteData.length > 0) {
      inputRefs.current[Math.min(pasteData.length, 3)].focus();
    }
  };

  const onActivate = async () => {
    setLoading(true);
    try {
      await sellerApi.activate(phone, code.join(''));
      addToast('Conta ativada!', 'success');
      navigate('/login');
    } catch (e) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
      addToast(e.response?.data?.message || 'Código inválido', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8faf8] p-4">
      <div className={`bg-white rounded-2xl shadow-sm border p-8 w-full max-w-[420px] animate-fade-in`}>
        <div className="flex flex-col items-center text-center">
          <div className="bg-brand-50 p-4 rounded-full mb-4">
            <MessageSquare size={48} className="text-brand-600" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-gray-800">Verifique seu WhatsApp</h2>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Enviamos um código para <span className="font-semibold text-gray-700">{phone}</span>.
          </p>
        </div>

        <div className={`flex gap-3 justify-center my-6 ${shakeError ? 'animate-shake' : ''}`}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:border-brand-500 focus:outline-none transition-colors"
            />
          ))}
        </div>

        <Button 
          onClick={onActivate} 
          className="w-full mb-4" 
          disabled={code.join('').length < 4}
          loading={loading}
        >
          Ativar conta
        </Button>

        <div className="text-center space-y-4">
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-400">Reenviar em {resendCooldown}s</p>
          ) : (
            <button 
              onClick={() => setResendCooldown(60)}
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              Reenviar código
            </button>
          )}

          <Link to="/cadastro" className="block text-sm text-gray-500 hover:text-gray-700">
            ← Voltar para o cadastro
          </Link>
        </div>
      </div>
    </div>
  );
}