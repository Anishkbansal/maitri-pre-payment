import React from 'react';
import TreatwellButton from '../components/TreatwellButton';

export default function ClinicPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Dr. VJ's Acupuncture Clinic</h1>
        
        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">About Dr. VJ</h2>
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img
                src="https://i.postimg.cc/yYgqdgjg/Dr-Arun-Vijayan-300x300.webp"
                alt="Dr. VJ"
                className="w-full md:w-64 rounded-lg shadow-md object-cover"
                loading="eager"
              />
              <div>
                <h3 className="text-2xl font-semibold text-navy-900 mb-2">
                  Arun Vijayan
                </h3>
                <p className="text-lg text-yellow-600">
                  DNA, MD (Acupuncture), MAc, MSc Osteopathy
                </p>
                <p className="text-lg font-medium text-navy-900 mt-4 mb-6">
                  Doctorate Neuroscience & Acupuncture | Licensed Acupuncturist | Certified Neuropuncturist
                </p>
                <p className="text-gray-700">
                  Dr. VJ is a distinguished, licensed acupuncturist and Clinical Neuroscientist specializing in Acupuncture. He holds a Doctorate in Neuroscience and Acupuncture and brings over 18 years of clinical experience to his practice.
                </p>
                <p className="text-gray-700 mt-4">
                  Originally from India, Dr. VJ's passion for healing and helping others led him to the United States, where he gained global recognition for treating more than 25,000 patients throughout his career as an Acupuncture Physician.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Specializations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">Specializations</h2>
          <div className="grid gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-yellow-400 transition-colors">
              <h3 className="font-semibold text-lg mb-2">Neurological Disorders</h3>
              <p className="text-gray-700">Multiple sclerosis, neuropathy, paralysis, and neurodegenerative disorders</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-yellow-400 transition-colors">
              <h3 className="font-semibold text-lg mb-2">Musculoskeletal Disorders</h3>
              <p className="text-gray-700">Chronic pain and unresponsive pain conditions</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-yellow-400 transition-colors">
              <h3 className="font-semibold text-lg mb-2">Mental Health</h3>
              <p className="text-gray-700">Clinical depression/major depressive disorder, particularly through neuroscience acupuncture. Dr. VJ's doctoral research focused on innovative treatments for Major Depressive Disorder using advanced neuroscience acupuncture techniques.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-yellow-400 transition-colors">
              <h3 className="font-semibold text-lg mb-2">Additional Specialties</h3>
              <p className="text-gray-700">Gynaecological Disorders and Eye disorders including glaucoma, con and rod dystrophy, optic neuritis</p>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">Neuroscience Acupuncture & Neuropuncture Expertise</h2>
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <p className="text-gray-700 mb-6">
              Dr. VJ is the only Certified Neuropuncturist in the UK, having completed postgraduate training in Neuroscience Acupuncture (Neuropuncture Foundation, US) and a Doctorate in Neuroscience from Akamai University, NC, USA.
            </p>
            <h3 className="font-semibold text-lg mb-4">Training Includes:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Human cadaver dissections</li>
              <li>Functional neurology</li>
              <li>Neuroanatomy and neurophysiology</li>
              <li>Orthopaedics and pain management</li>
              <li>Internal medicine</li>
            </ul>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">Education & Credentials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Education:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Doctor of Neuroscience</li>
                <li>Doctor of Medicine (Acupuncture)</li>
                <li>Master of Acupuncture</li>
                <li>Master of Science in Osteopathy</li>
                <li>Master of Public Health (Global Health – Candidate)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Governing/Licensing Body:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>The Acupuncture Society, U.K.</li>
                <li>Liverpool City Council</li>
                <li>Maharashtra Council of Acupuncture, Govt of India
                  <div className="ml-4 mt-1 text-sm text-gray-600">Licensed Acupuncturist</div>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-600 italic">* Dr. VJ is not a registered western medical doctor</p>
            </div>
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