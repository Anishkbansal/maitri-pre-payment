import React from 'react';
import TreatwellButton from '../components/TreatwellButton';

export default function AcugraphPage() {
  const faqs = [
    {
      question: "What is AcuGraph?",
      answer: "AcuGraph is a computerized tool that measures and analyzes the energy meridians in your body, providing objective measurements to help guide your treatment."
    },
    {
      question: "What are Acupuncture Meridians?",
      answer: "Meridians are energy pathways in your body through which Qi (life force energy) flows. These pathways connect different parts of your body and maintain balance."
    },
    {
      question: "What does my P.I.E. score mean?",
      answer: "The P.I.E. (Personal Integrated Energetics) score is a comprehensive measurement of your overall meridian energy balance. It helps track your progress over time."
    },
    {
      question: "How can AcuGraph help me?",
      answer: "AcuGraph provides objective measurements of your meridian energy, helping us identify imbalances and track your progress through treatment. This allows for more precise and effective treatments."
    },
    {
      question: "Is AcuGraph Safe?",
      answer: "Yes, AcuGraph is completely safe. It uses a very small electrical current (much less than a battery) to take measurements. The procedure is non-invasive and painless."
    },
    {
      question: "Will I feel anything?",
      answer: "Most patients feel nothing during the examination. Some may feel a slight tingling sensation at the measurement points, but this is temporary and harmless."
    },
    {
      question: "What will I learn from the AcuGraph exam?",
      answer: "You'll receive detailed information about your energy meridians, including which ones are balanced and which need attention. This helps us create a more targeted and effective treatment plan."
    },
    {
      question: "How often should I have an AcuGraph exam?",
      answer: "We typically recommend regular examinations to track your progress. The frequency depends on your condition and treatment plan, which we'll discuss during your consultation."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">AcuGraph Digital Meridian Imaging</h1>
        
        {/* Hero Image */}
        <div className="mb-12">
          <img
            src="https://i.postimg.cc/WzC084D3/Maitri-Liverpool-20231102-056.jpg"
            alt="AcuGraph Analysis Session"
            className="w-full h-[400px] rounded-lg shadow-lg object-cover object-top"
          />
          <p className="text-center text-gray-600 mt-2 italic">AcuGraph Analysis Session in Progress</p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 mb-6">
            Modern medicine is so science based that it often doesn't allow for variances and the nuances of the individual.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            The AcuGraph Digital Meridian Imaging system is where ancient wisdom meets modern technology. This computerised tool analyses the energy flow through a patient's meridian lines and the information ascertained gives a clearer picture of a patient's condition and helps to provide the best treatment possible.
          </p>
          <p className="text-lg text-yellow-600 font-semibold">
            We are really proud to be one of only 3 clinics in the country to offer Acugraph.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-yellow-400 transition-colors"
              >
                <summary className="text-lg font-medium text-navy-900 cursor-pointer">
                  {faq.question}
                </summary>
                <div className="mt-4 text-gray-700">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <TreatwellButton />
        </section>
      </div>
    </div>
  );
}