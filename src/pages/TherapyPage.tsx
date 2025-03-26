import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { therapyContent } from '../data/therapies';
import TreatwellButton from '../components/TreatwellButton';

export default function TherapyPage() {
  const { therapy } = useParams();
  const content = therapy ? therapyContent[therapy] : null;

  if (!content) {
    return (
      <div className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Therapy not found</h1>
            <Link to="/" className="mt-4 inline-flex items-center text-yellow-600 hover:text-yellow-700">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-8">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-navy-900 mb-4">{content.title}</h1>
        {content.subtitle && (
          <p className="text-xl text-yellow-600 mb-6">{content.subtitle}</p>
        )}
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8">{content.description}</p>
          
          {content.benefits && (
            <>
              <h2 className="text-2xl font-semibold text-navy-900 mb-4">Benefits</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-yellow-600 mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {content.expertInfo && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold text-navy-900 mb-4">Expert Care</h2>
              <p className="text-gray-700">{content.expertInfo}</p>
            </div>
          )}
          
          {content.additionalContent?.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-navy-900 mb-4">{section.title}</h2>
              <p className="text-gray-700">{section.content}</p>
            </div>
          ))}
          
          <div className="mt-12 text-center">
            <TreatwellButton />
          </div>
        </div>
      </div>
    </div>
  );
}