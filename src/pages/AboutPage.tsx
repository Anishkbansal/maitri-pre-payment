import React from 'react';
import { Calendar } from 'lucide-react';
import VideoHero from '../components/VideoHero';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">About Us</h1>
        
        {/* Hero Image */}
        {/* <div className="mb-12">
          <img
            src="https://i.postimg.cc/brBdH22D/Maitri-Liverpool-20231102-003.jpg"
            alt="Maitri Liverpool"
            className="w-full h-[400px] rounded-lg shadow-lg object-cover"
          />
        </div> */}
        
        {/* Hero Video Section */}
        <div className="mb-12 rounded-lg shadow-lg overflow-hidden">
          <VideoHero height="h-[400px]" showContent={false} />
        </div>

        {/* Who We Are Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Who We Are</h2>
          <p className="text-lg text-gray-700 mb-6">
            Maitri is a holistic space in Liverpool which offers a number of services.
          </p>
        </section>

        {/* What Maitri Means Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Maitri – What does it mean?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Maitri – pronounced (mytri) though in Liverpool it is fondly pronounced (maytree) is taken from the Sanskrit and Hindi language and translates as benevolence, loving kindness or very simply friend.
          </p>
        </section>

        {/* Our Community Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Our Community</h2>
          <p className="text-lg text-gray-700 mb-6">
            We are very proud that many of the people who walk through our door as clients and patients become friends and become part of our community. We offer a variety of Alternative Therapies but are always open to bringing new treatments into our portfolio – just let us know if you would like us to offer any treatment not named in our Services section.
          </p>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <p className="text-xl text-gray-700 mb-8">
            Discover our range of holistic treatments and experience the Maitri difference.
          </p>
          <button className="bg-yellow-600 text-white px-8 py-4 rounded-md hover:bg-yellow-700 transition-colors duration-150 inline-flex items-center text-lg font-medium">
            <Calendar className="h-6 w-6 mr-2" />
            Book an Appointment
          </button>
        </section>
      </div>
    </div>
  );
}