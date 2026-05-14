import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sellerApi } from '../../api/seller';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/index';
import { MessageSquare, ArrowLeft } from 'lucide-react';

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
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4).split('');
    const newCode = [...code];
    pasteData.forEach((char, i) => { if (/^\d$/.test(char)) newCode[i] = char; });
    setCode(newCode);
    if (pasteData.length > 0) inputRefs.current[Math.min(pasteData.length, 3)].focus();
  };

  const onActivate = async () => {
    setLoading(true);
    console.log('Ativando para o telefone:', phone, 'com o código:', code.join(''));
    try {
      await sellerApi.activate(phone, code.join(''));
      addToast('Conta ativada com sucesso!', 'success');
      navigate('/login');
    } catch (e) {
      console.error('Erro na ativação:', e.response?.data || e.message);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
      addToast(e.response?.data?.message || 'Erro ao ativar conta. Verifique o código.', 'error');
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
            Enviamos um código para <span className="font-semibold text-gray-700">{phone || 'número não informado'}</span>.
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
          disabled={code.join('').length < 4 || !phone}
          loading={loading}
        >
          Confirmar Código
        </Button>

        <div className="text-center space-y-4 pt-2">
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-400">Reenviar código em {resendCooldown}s</p>
          ) : (
            <button 
              onClick={() => {
                setResendCooldown(60);
                addToast('Solicitação de reenvio enviada!', 'info');
              }}
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              Reenviar código agora
            </button>
          )}

          <Link to="/cadastro" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} />
            Voltar e corrigir dados
          </Link>
        </div>
      </div>
    </div>
  );
}