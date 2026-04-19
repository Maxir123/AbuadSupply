import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTags,
  FaBox,
  FaTruck,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";

const FAQ_ITEMS = [ /* ... same as before ... */ ];

const CATEGORIES = [ /* ... same ... */ ];

const AccordionItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-200 hover:bg-gray-50">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="font-medium text-gray-800">{question}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 text-sm">{answer}</p>
      </div>
    </div>
  );
};

const FaqContent = () => {
  const [activeId, setActiveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleItem = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchSearch =
        searchTerm === "" ||
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h1>
      <div className="relative mb-8">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          className="w-full pl-10 py-2 border rounded-full"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-sm border ${
              activeCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        {filteredItems.map((item) => (
          <AccordionItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            isOpen={activeId === item.id}
            toggle={() => toggleItem(item.id)}
          />
        ))}
      </div>
      <div className="text-center mt-10 bg-blue-50 p-6 rounded-xl">
        <h3 className="font-semibold text-lg">Still need help?</h3>
        <p className="text-gray-600 mb-4">
          Our support team is ready to help you.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded-full"
        >
          Contact Support →
        </Link>
      </div>
    </div>
  );
};

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>FAQ | Aboad Supply</title>
      </Head>
      <Header />
      <FaqContent />
      <Footer />
    </>
  );
}