import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Loader2, 
  HelpCircle, 
  ArrowRight, 
  AlertTriangle,
  Info,
  Wrench
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      sender: 'ai', 
      text: 'Olá! Sou o Power Find Parts AI, seu assistente mecânico especialista da Sagacitas Industrial. Como posso ajudar você hoje com a compatibilidade de peças ou diagnósticos de alternadores e baterias?' 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const suggestions = [
    "Qual alternador serve no Gol 2013?",
    "Como testar subtensão de 13.8V no Voyage?",
    "Quais as especificações da correia Valeo?",
    "Como cadastrar nova peça vinculada?"
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao consultar o assistente.");
      }

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: data.response
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Erro na consulta do assistente:", err);
      setErrorMessage(err.message || "Erro desconhecido ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-assistant-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* Suggestions / Prompt helpers column */}
      <div className="space-y-4">
        <div className="bg-primary text-on-primary p-5 rounded-md shadow-sm relative overflow-hidden border border-outline-variant/10">
          <div className="relative z-10 space-y-3">
            <h3 className="font-headline text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-tertiary-fixed" /> Inteligência Power Find
            </h3>
            <p className="text-[11px] leading-relaxed text-white/80">
              Utilize o assistente de IA integrado para tirar dúvidas técnicas sobre alternadores, tensões e compatibilidade de forma instantânea.
            </p>
          </div>
          {/* Abstract backdrop */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <Wrench className="w-24 h-24 rotate-45" />
          </div>
        </div>

        <div className="bg-[#eceeef] p-5 rounded-md border border-outline-variant/10 shadow-sm space-y-3.5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Perguntas Frequentes
          </h4>
          <div className="space-y-2">
            {suggestions.map((s, index) => (
              <button
                key={index}
                onClick={() => handleSend(s)}
                disabled={loading}
                className="w-full text-left bg-white hover:bg-surface-container-low text-xs font-bold text-primary p-3 rounded border border-outline-variant/10 transition-all hover:translate-x-0.5 active:scale-[0.98] flex items-center justify-between group disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>{s}</span>
                <ArrowRight className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Interface column */}
      <div className="lg:col-span-2 bg-white rounded-md border border-outline-variant/15 shadow-sm flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed animate-pulse"></div>
            <span className="font-headline text-xs font-black uppercase text-primary tracking-wider">Suporte Técnico de IA</span>
          </div>
          <span className="text-[9px] font-black uppercase text-outline">Modelo: Gemini 3.5 Flash</span>
        </div>

        {/* Chat Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-secondary-container text-on-secondary-fixed-variant border border-outline-variant/10'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded shadow-sm text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary text-white font-medium rounded-tr-none'
                  : 'bg-[#f2f4f5] text-primary rounded-tl-none border border-outline-variant/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed-variant border border-outline-variant/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#f2f4f5] p-3.5 rounded rounded-tl-none border border-outline-variant/5 text-xs text-outline flex items-center gap-2 shadow-sm font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                Analisando documentação técnica...
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-error-container/40 border border-error-container text-error rounded text-xs flex gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Falha na Conexão:</p>
                <p className="text-[11px] mt-0.5 leading-relaxed font-semibold">
                  {errorMessage.includes(" GEMINI_API_KEY") 
                    ? "A chave de IA do Gemini ainda não foi cadastrada. Por favor, acesse o menu de Configurações (ícone de engrenagem no topo direito) para registrar seu Segredo no painel do AI Studio."
                    : errorMessage}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input form footer */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 border-t border-outline-variant/10 flex gap-2 bg-surface-container-low"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Digite sua dúvida mecânica ou de compatibilidade..."
            className="flex-1 bg-white border border-outline-variant/20 rounded-md px-3.5 py-2.5 text-xs outline-none focus:border-primary disabled:opacity-50 text-on-surface font-body"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 p-2.5 rounded-md transition-colors active:scale-95 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
