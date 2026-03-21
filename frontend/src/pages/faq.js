// pages/faq.js
import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/styles/styles';

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? 0 : tab);
  };

  return (
    <div className={`${styles.section} my-8 px-4 sm:px-6 lg:px-8`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
      <div className="mx-auto space-y-4">
        {/* FAQ Questions */}
        {[ 
          { id: 1, question: "How do I track my order?", answer: "Depending on the shipping method you chose, it's possible that the tracking information might not be visible immediately." },
          { id: 2, question: "What is your return policy?", answer: "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@myecommercestore.com with your order number and a brief explanation of why you're returning the item." },
          { id: 3, question: "Can I change or cancel my order?", answer: "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery." },
          { id: 4, question: "How do I contact customer support?", answer: "You can contact our customer support team by emailing us at support@myecommercestore.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday." },
          { id: 5, question: "What payment methods do you accept?", answer: "We accept visa, mastercard, paypal payment methods also we have cash on delivery system." },
          { id: 5, question: "What payment methods do you accept?", answer: "We accept Visa, MasterCard, PayPal, and we also offer cash on delivery." },
          { id: 6, question: "Do you offer international shipping?", answer: "Yes, we offer international shipping to most countries. Shipping rates and delivery times vary based on your location." },
          { id: 7, question: "Can I track my return?", answer: "Yes, once your return is processed, we will send you a confirmation email with tracking information." },
          { id: 8, question: "How long does shipping take?", answer: "Shipping times vary depending on your location and the shipping method chosen. Generally, domestic orders arrive within 5-7 business days, while international orders may take 2-4 weeks." },
          { id: 9, question: "What should I do if I received a defective item?", answer: "If you receive a defective item, please contact us immediately at support@myecommercestore.com with your order number and a description of the issue. We will assist you in resolving the problem." },
          { id: 10, question: "Can I use multiple discount codes on one order?", answer: "No, only one discount code can be applied per order. However, you may use one code for each transaction." },
        ].map(({ id, question, answer }) => (
          <div key={id} className="border-b border-gray-200 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(id)}
            >
              <span className="text-lg font-medium text-gray-900">
                {question}
              </span>
              {activeTab === id ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === id && (
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  {answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQPage = () => {
  return (
    <>
      <Head>
        <title>FAQ</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <Header />
      <Faq />
      <Footer />
    </>
  );
};

export default FAQPage;
