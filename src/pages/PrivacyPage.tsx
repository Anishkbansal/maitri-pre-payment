import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Privacy Policy</h1>
        
        {/* Who We Are Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Who we are</h2>
          <p className="text-lg text-gray-700 mb-6">
            Our website address is: https://maitri-liverpool.co.uk.
          </p>
        </section>

        {/* Personal Data Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">What personal data we collect</h2>
          
          <h3 className="text-xl font-semibold text-navy-900 mt-8 mb-4">Comments</h3>
          <p className="text-lg text-gray-700 mb-6">
            When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
          </p>

          <h3 className="text-xl font-semibold text-navy-900 mt-8 mb-4">Media</h3>
          <p className="text-lg text-gray-700 mb-6">
            If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
          </p>

          <h3 className="text-xl font-semibold text-navy-900 mt-8 mb-4">Cookies</h3>
          <p className="text-lg text-gray-700 mb-6">
            If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            If you have an account and you log in to this site, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
          </p>
        </section>

        {/* Your Rights Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Your Rights</h2>
          <p className="text-lg text-gray-700 mb-6">
            If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
          </p>
        </section>

        {/* Contact Information Section */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Contact Information</h2>
          <p className="text-lg text-gray-700 mb-6">
            For any privacy-related concerns, please contact us at:
          </p>
          <address className="text-lg text-gray-700 not-italic">
            Maitri Liverpool Limited<br />
            127 - 131 Picton Road<br />
            Liverpool<br />
            Merseyside<br />
            L15 4LG<br />
            <br />
            <a href="mailto:Kindness@maitri-liverpool.co.uk" className="text-yellow-600 hover:text-yellow-700">
              Kindness@maitri-liverpool.co.uk
            </a>
          </address>
        </section>
      </div>
    </div>
  );
}