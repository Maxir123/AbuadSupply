import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'react-toastify';

const Support = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const { data } = await axios.post('/api/support/contact', {
        email,
        subject,
        message,
      });
      toast.success('Your message has been sent!');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  
  return (
    <>
      <Head>
        <title>Customer Service - Help &amp; Support</title>
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 bg-gray-50 py-10 px-4 sm:px-10">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-700 mb-4">How can we help you today?</h1>
            <p className="text-gray-600 text-lg">Whether you&apos;re a buyer or a vendor, we’re here to assist you. </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            <div className="bg-white p-6 rounded shadow text-center">
              <FaComments className="mx-auto text-3xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-lg">Live Chat</h3>
              <p className="text-gray-600">Chat with us for instant help</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <FaEnvelope className="mx-auto text-3xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-lg">Email Support</h3>
              <p className="text-gray-600">support@sahanso.com</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <FaPhone className="mx-auto text-3xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-lg">Call Us</h3>
              <p className="text-gray-600">+1 555-123-4567</p>
            </div>
          </div>

          {/* Help Topics */}
          <div className="max-w-4xl mx-auto mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Popular Help Topics</h2>
            <div className="grid gap-4">
              <Accordion title="How do I verify my vendor identity?">
                You can upload your business documents in your Vendor Dashboard under the &lsquo;Verification&rsquo; tab.
              </Accordion>
              <Accordion title="What happens if a customer requests a refund?">
                Our system will notify the vendor and hold the transaction amount until the issue is resolved.
              </Accordion>
              <Accordion title="How can I promote my products?">
                Vendors can create coupons, mark products as featured, or participate in flash sales from their dashboard.
              </Accordion>
              <Accordion title="What are the fees for selling on this platform?">
                Please refer to our vendor terms or check the &lsquo;Fees &amp; Commissions&rsquo; section in your Vendor Dashboard.
              </Accordion>
            </div>
          </div>
          {/* Submit Request Form */}
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-12">
            <h2 className="text-xl font-bold mb-4">Submit a Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
              <textarea
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full p-3 border border-gray-300 rounded"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 font-medium text-lg focus:outline-none"
      >
        {title}
        <span className="float-right">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="py-2 text-gray-700 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

export default Support;
