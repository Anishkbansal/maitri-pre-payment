import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import TreatwellButton from '../components/TreatwellButton';
import VideoHero from '../components/VideoHero';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <VideoHero />

      {/* Services Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">Our Therapies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Neuropuncture",
                path: "neuropuncture",
                description: "Advanced treatment combining traditional acupuncture with modern neuroscience for enhanced pain relief, improved healing, and optimal nervous system function."
              },
              {
                title: "Acupuncture",
                path: "acupuncture",
                description: "Traditional Chinese medicine approach using precise needle placement to balance energy flow, treat arthritis, reduce pain, manage stress, and enhance overall wellness naturally."
              },
              {
                title: "German Auricular Medicine",
                path: "german-auricular-medicine",
                description: "A sophisticated system focusing on the central nervous system for precise diagnosis and treatment. Provides targeted healing through ear acupuncture points."
              },
              {
                title: "Massage",
                path: "massage",
                description: "Experience deep relaxation and healing with our therapeutic massage treatments, customized to address your specific needs and promote overall wellbeing."
              },
              {
                title: "Women's Health",
                path: "womens-health",
                description: "Specialized holistic treatments supporting women's wellbeing throughout all life stages, from menstrual health to fertility and menopause management."
              }
            ].map((service, index) => (
              <Link
                key={index}
                to={`/therapy/${service.path}`}
                className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:border-yellow-400 transition-colors duration-300 group"
              >
                <h3 className="text-xl font-semibold mb-3 text-navy-900 group-hover:text-yellow-600">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <span className="text-navy-900 flex items-center group-hover:text-yellow-600">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Wellness Journey?</h2>
          <p className="mb-8">Book your first consultation today and take the first step towards better health.</p>
          <TreatwellButton />
        </div>
      </div>

      {/* Insurance Providers */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-navy-900">Insurance Providers We Accept</h2>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {["Paycare", "Cigna", "Aviva", "Simply Health", "Allianz", "Medicash", "BHSF"].map((provider, index) => (
              <span key={index} className="text-navy-900 font-medium">
                {provider}
                {index < 6 && <span className="hidden md:inline"> • </span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}