import { useState } from 'react';
import { 
  HelpCircle, Phone, MapPin, Send, MessageSquare, 
  Languages, User, HeartPulse, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientSupport = () => {
  const [language, setLanguage] = useState('EN'); // EN or TA (Tamil)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your CureWell Health Assistant. How can I help you today?', textTa: 'வணக்கம்! நான் உங்கள் கியூர்வெல் சுகாதார உதவியாளர். இன்று உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?' }
  ]);
  const [inputText, setInputText] = useState('');

  const translations = {
    EN: {
      helpline: 'Hospital Emergency Helpline',
      supportDesc: 'Call our 24/7 registration desk or emergency response unit for quick assistance.',
      mapTitle: 'CureWell Hospital Location',
      mapDesc: 'Sector 4, Phase II, Dwarka, New Delhi - 110075',
      chatbotTitle: 'AI Health Companion',
      chatbotDesc: 'Ask questions about hospital wings, report downloads, or medicine reminders.',
      send: 'Send',
      inputPlaceholder: 'Type your question here (e.g., North Wing location, report download)...',
      questions: [
        'Where is the North Wing OP block?',
        'How do I download my lab reports?',
        'What should I do if I missed a pill?',
        'How can I contact my doctor?'
      ],
      answers: {
        'where is the north wing op block?': 'The General Medicine OP block has shifted to the new North Wing building, 2nd Floor. Follow the blue signs from the main lobby.',
        'how do i download my lab reports?': 'Go to the "Reports & Labs" section in the sidebar. Click the "Download Report PDF" button next to your specific test results.',
        'what should i do if i missed a pill?': 'If you miss a dose, take it as soon as you remember. If it is close to your next scheduled dose, skip the missed dose. Do not double doses.',
        'how can i contact my doctor?': 'You can call our primary support line at +91 98765 43210 and request a call transfer to Dr. Suresh Kumar’s clinical desk.'
      }
    },
    TA: {
      helpline: 'மருத்துவமனை அவசர உதவி எண்',
      supportDesc: 'விரைவான உதவிக்கு எங்களின் 24/7 பதிவு மேசை அல்லது அவசர உதவிப் பிரிவை அழைக்கவும்.',
      mapTitle: 'மருத்துவமனை இருப்பிடம்',
      mapDesc: 'செக்டார் 4, கட்டம் II, துவாரகா, புது தில்லி - 110075',
      chatbotTitle: 'செயற்கை நுண்ணறிவு சுகாதார உதவியாளர்',
      chatbotDesc: 'மருத்துவமனை பிரிவுகள், அறிக்கைகள் பதிவிறக்கம் அல்லது மருந்து நினைவூட்டல்கள் பற்றி கேள்விகள் கேட்கலாம்.',
      send: 'அனுப்பு',
      inputPlaceholder: 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...',
      questions: [
        'வடக்கு பிரிவு எங்கே உள்ளது?',
        'ஆய்வக அறிக்கைகளை எவ்வாறு பதிவிறக்குவது?',
        'மாத்திரையை மறந்தால் என்ன செய்ய வேண்டும்?',
        'மருத்துவரை எவ்வாறு தொடர்பு கொள்வது?'
      ],
      answers: {
        'where is the north wing op block?': 'பொது மருத்துவப் பிரிவு புதிய வடக்கு கட்டிடத்தின் 2வது தளத்திற்கு மாற்றப்பட்டுள்ளது. பிரதான வரவேற்பறையில் இருந்து நீல நிற பலகைகளை பின்பற்றவும்.',
        'how do i download my lab reports?': 'பக்கவாட்டு மெனுவில் உள்ள "Reports & Labs" பகுதிக்குச் செல்லவும். உங்கள் சோதனை முடிவுகளுக்கு அடுத்துள்ள "Download Report PDF" பொத்தானைக் கிளிக் செய்யவும்.',
        'what should i do if i missed a pill?': 'மறந்த மாத்திரையை நினைவு வந்தவுடன் உட்கொள்ளவும். அடுத்த வேளைக்கு நேரமாகிவிட்டால், தவறவிட்ட மாத்திரையைத் தவிர்த்துவிட்டு அடுத்த வேளை மாத்திரையை வழக்கம்போல் உட்கொள்ளவும்.',
        'how can i contact my doctor?': 'எங்கள் முதன்மை உதவி எண்ணான +91 98765 43210 ஐ அழைத்து, டாக்டர் சுரேஷ் குமாரின் மருத்துவ மேசைக்கு இணைப்பை மாற்றுமாறு கோரலாம்.'
      }
    }
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: text, textTa: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Process bot answer
    setTimeout(() => {
      // Find answer based on english mapping keys
      let searchKey = text.toLowerCase();
      // Handle Tamil clicks mapping to english keys for lookup
      if (language === 'TA') {
        const qIdx = translations.TA.questions.indexOf(text);
        if (qIdx !== -1) {
          searchKey = translations.EN.questions[qIdx].toLowerCase();
        }
      }

      const answerEn = translations.EN.answers[searchKey] || "I'm sorry, I didn't understand that clinical question. Please ask something else or contact the physical helpdesk.";
      const answerTa = translations.TA.answers[searchKey] || "மன்னிக்கவும், அந்த மருத்துவக் கேள்வி எனக்குப் புரியவில்லை. வேறு ஏதாவது கேட்கவும் அல்லது உதவி மையத்தைத் தொடர்பு கொள்ளவும்.";

      const botMsg = { sender: 'bot', text: answerEn, textTa: answerTa };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const currentText = translations[language];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-650" /> Support Desk & Help center
          </h1>
          <p className="text-xs text-slate-500 mt-1">Get instant assistance from our AI chatbot, call hospital helplines, or trace clinical GPS coordinates.</p>
        </div>

        {/* Language selector */}
        <button 
          onClick={() => setLanguage(language === 'EN' ? 'TA' : 'EN')}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          <Languages className="w-4 h-4 text-blue-600" /> Language: {language === 'EN' ? 'English' : 'தமிழ் (Tamil)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Helplines & Map location */}
        <div className="space-y-6">
          {/* Helpline Card */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-850 flex items-center gap-2">
              <Phone className="w-4.5 h-4.5 text-red-500" /> {currentText.helpline}
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">{currentText.supportDesc}</p>
            
            <div className="space-y-2 pt-2">
              <a 
                href="tel:+919876543210"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/20"
              >
                <Phone size={14} className="animate-pulse" /> Call Hospital Desk
              </a>
              <a 
                href="tel:+919876543210"
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-250 text-slate-700 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Doctor Consultation Desk
              </a>
            </div>
          </div>

          {/* Map Card */}
          <div className="premium-card-static bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-850 flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-blue-650" /> {currentText.mapTitle}
            </h3>
            
            {/* Styled Map frame */}
            <div className="h-44 w-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner flex flex-col justify-center items-center p-4 text-center">
              <div className="absolute inset-0 bg-blue-50/10 backdrop-blur-[1px] pointer-events-none"></div>
              {/* Map grid representation */}
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-lg border-2 border-white mb-2">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">{currentText.mapTitle}</span>
              <p className="text-[9px] text-slate-500 mt-1 max-w-[200px]">{currentText.mapDesc}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Chatbot */}
        <div className="lg:col-span-2 premium-card-static bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[520px]">
          {/* Chatbot Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-650" />
              <div>
                <h3 className="text-xs font-bold text-slate-800">{currentText.chatbotTitle}</h3>
                <p className="text-[9px] text-slate-400 font-semibold">{currentText.chatbotDesc}</p>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/20">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              const textToShow = language === 'EN' ? m.text : m.textTa;
              
              return (
                <div key={idx} className={`flex gap-3 max-w-[80%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-sm ${
                    isBot ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 border border-slate-300'
                  }`}>
                    {isBot ? 'AI' : 'U'}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                    isBot ? 'bg-white border border-slate-100 text-slate-800' : 'bg-blue-650 bg-blue-650 text-white'
                  }`}>
                    {textToShow}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Recommendations */}
          <div className="p-3 bg-slate-50/50 border-t border-slate-100">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Suggested Questions</span>
            <div className="flex flex-wrap gap-1.5">
              {currentText.questions.map((q, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-[10px] text-slate-650 hover:text-blue-700 font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  {q} <ChevronRight size={10} />
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-white border-t border-slate-100 flex gap-2"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={currentText.inputPlaceholder}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <button 
              type="submit"
              className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default PatientSupport;
