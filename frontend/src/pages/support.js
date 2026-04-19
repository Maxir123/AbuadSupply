import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { 
  FaSearch, FaEnvelope, FaComments, FaHeadset, 
  FaShieldAlt, FaStore, FaCreditCard, FaQuestionCircle,
  FaPaperPlane, FaSpinner, FaCheckCircle, FaRobot,
  FaArrowRight, FaTimes, FaUserHeadset, FaWhatsapp
} from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'react-toastify';

// --- Helper API call ---
const sendSupportRequest = async (email, subject, message) => {
  const { data } = await axios.post('/api/support/contact', { email, subject, message });
  return data;
};

// --- Knowledge Base Articles (searchable) ---
const allArticles = [
  { id: 1, category: 'Vendor', title: 'How to verify vendor identity?', content: 'Upload business documents in Vendor Dashboard → Verification. Takes 1-2 days.' },
  { id: 2, category: 'Refunds', title: 'Customer refund process', content: 'System holds amount until resolution. Vendor & buyer collaborate.' },
  { id: 3, category: 'Promotion', title: 'Promote your products', content: 'Use coupons, featured listings, flash sales from dashboard.' },
  { id: 4, category: 'Fees', title: 'Platform fees explained', content: 'No hidden fees. See Vendor Dashboard → Fees & Commissions.' },
  { id: 5, category: 'Account', title: 'Change account settings', content: 'Go to Profile → Account Settings to update email, password, etc.' },
  { id: 6, category: 'Shipping', title: 'Tracking orders', content: 'Vendors provide tracking numbers. Buyers see updates in Order History.' },
];

// --- Live Chat Modal (simulated with auto-reply) ---
const LiveChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Hi! How can I help you today?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [email, setEmail] = useState('');

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text, time: new Date() }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!email.trim()) {
      toast.error('Please enter your email first.');
      return;
    }
    addMessage('user', input);
    const userMsg = input;
    setInput('');
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      addMessage('bot', `Thanks for your message! Our team will get back to you at ${email} within a few hours. Meanwhile, check our FAQ section.`);
      setIsTyping(false);
      // Also send to backend as chat request
      sendSupportRequest(email, 'Live Chat Inquiry', userMsg).catch(err => console.error);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[500px] animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <FaUserHeadset className="text-blue-600 text-xl" />
            <h3 className="font-bold text-gray-800">Live Support</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'}`}>
                <p className="text-sm">{msg.text}</p>
                <span className="text-[10px] opacity-70 block mt-1">
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-2 shadow-sm flex gap-1">
                <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t bg-white">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full p-2 mb-2 border rounded-xl text-sm"
          />
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 p-2 border rounded-xl text-sm"
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Support Page ---
const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ticket'); // 'ticket' or 'chat'
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendSupportRequest(formData.email, formData.subject, formData.message);
      toast.success('Ticket submitted! We’ll respond shortly.');
      setFormData({ email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter articles based on search
  const filteredArticles = allArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Help Center | Support & Knowledge Base</title>
        <meta name="description" content="Search our knowledge base, submit a ticket, or chat with support." />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          {/* Hero with Search */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">How can we help?</h1>
              <p className="text-blue-100 text-lg mb-8">Find answers, submit a request, or talk to a real person.</p>
              <div className="relative max-w-xl mx-auto">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for articles, e.g., 'vendor verification'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>

          {/* Knowledge Base Results */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center gap-2 mb-6">
              <FaQuestionCircle className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Popular Help Topics</h2>
            </div>
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <p className="text-gray-500">No articles found. Try a different keyword or contact support.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filteredArticles.map(article => (
                  <div key={article.id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border-l-4 border-blue-500">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{article.category}</span>
                    <h3 className="font-bold text-lg mt-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{article.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section - Split Tabs */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('ticket')}
                    className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${
                      activeTab === 'ticket'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FaEnvelope /> Submit a Ticket
                  </button>

                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${
                      activeTab === 'whatsapp'
                        ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FaWhatsapp /> WhatsApp Support
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">

                  {/* Ticket Form */}
                  {activeTab === 'ticket' && (
                    <form onSubmit={handleTicketSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1 w-full p-3 border rounded-xl focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subject *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="mt-1 w-full p-3 border rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="mt-1 w-full p-3 border rounded-xl"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaPaperPlane />
                        )}
                        {isSubmitting ? 'Sending...' : 'Send Ticket'}
                      </button>
                    </form>
                  )}

                  {/* WhatsApp Support */}
                  {activeTab === 'whatsapp' && (
                    <div className="text-center py-8">
                      <FaWhatsapp className="text-6xl text-green-500 mx-auto mb-4" />

                      <h3 className="text-xl font-bold">
                        Chat with us on WhatsApp
                      </h3>

                      <p className="text-gray-600 mt-2 mb-6">
                        Need quick help? Our support team is available on WhatsApp. Click below to start a conversation.
                      </p>

                      <a
                        href="https://wa.me/234720040449?text=Hello%20I%20need%20help%20with%20my%20order"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition"
                      >
                        <FaWhatsapp /> Chat on WhatsApp
                      </a>

                      {/* Optional call button */}
                      <div className="mt-4">
                        <a
                          href="tel:+234720040449"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Or call support
                        </a>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          {/* Quick Help Cards */}
          <div className="max-w-6xl mx-auto px-4 pb-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: FaShieldAlt, title: 'Buyer Protection', desc: 'Secure payments & dispute resolution' },
                { icon: FaStore, title: 'Vendor Hub', desc: 'Manage products, orders, and analytics' },
                { icon: FaCreditCard, title: 'Flexible Payments', desc: 'Card, PayPal, installment options' },
                { icon: FaHeadset, title: '24/7 Support', desc: 'Email and chat assistance' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl shadow-sm hover:shadow-md transition text-center">
                  <item.icon className="text-3xl text-blue-600 mx-auto mb-3" />
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <LiveChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.2s ease-out; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </>
  );
};

export default Support;