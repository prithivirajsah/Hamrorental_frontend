import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQs() {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      id: 1,
      question: "What documents do I need to rent a car?",
      answer: "You need a valid driving license, a government-issued ID (citizenship or passport), and a credit/debit card for security deposit. International visitors may need an International Driving Permit."
    },
    {
      id: 2,
      question: "What is the minimum age to rent a vehicle?",
      answer: "The minimum age to rent a vehicle is 21 years old. Drivers between 21-25 may be subject to a young driver surcharge."
    },
    {
      id: 3,
      question: "Can I extend my rental period?",
      answer: "Yes, you can extend your rental period subject to vehicle availability. Please contact us at least 24 hours before your scheduled return time to arrange an extension."
    },
    {
      id: 4,
      question: "What happens if I return the car late?",
      answer: "Late returns are subject to additional charges. We offer a 30-minute grace period, after which you'll be charged for an additional day."
    },
    {
      id: 5,
      question: "Is insurance included in the rental price?",
      answer: "Basic insurance is included in all our rental packages. We also offer comprehensive insurance packages for additional coverage and peace of mind."
    },
    {
      id: 6,
      question: "Can I cancel my reservation?",
      answer: "Yes, you can cancel your reservation. Cancellations made 24+ hours before pickup are free. Cancellations within 24 hours may incur a fee."
    },
    {
      id: 7,
      question: "Do you provide drivers?",
      answer: "Yes, we offer professional driver services for an additional fee. Our drivers are experienced, licensed, and familiar with local routes."
    },
    {
      id: 8,
      question: "What fuel policy do you have?",
      answer: "We operate on a full-to-full fuel policy. You receive the car with a full tank and should return it with a full tank to avoid additional fuel charges."
    }
  ]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Find answers to common questions about our car rental and driver services.
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-indigo-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
              Contact Support
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
