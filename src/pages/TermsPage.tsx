import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Terms and Conditions</h1>
        
        {/* Introduction Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">1. Introduction</h2>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to Maitri Liverpool Limited ("we," "our," "us"). By accessing or using our website (www.maitri-liverpool.co.uk) and services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these terms, please do not use our website or services.
          </p>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">2. Services</h2>
          <p className="text-lg text-gray-700 mb-6">
            We offer a variety of complementary therapies and products, including but not limited to acupuncture, massage, Chinese fire cupping, neuropuncture, reflexology, and women's health services. Detailed descriptions of our services are available on our website.
          </p>
        </section>

        {/* Appointments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">3. Appointments and Bookings</h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              <span className="font-medium">Scheduling:</span> Appointments can be scheduled through our online booking system or by contacting us directly.
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Cancellations:</span> Clients must provide at least 24 hours' notice for cancellations or rescheduling. Failure to do so may result in a cancellation fee equivalent to 100% of the service cost.
            </p>
          </div>
        </section>

        {/* Payments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">4. Payments</h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              <span className="font-medium">Payment Methods:</span> We accept payments via Stripe and Klarna. By choosing these payment options, you agree to comply with their respective terms and conditions.
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Stripe:</span> Stripe is a secure payment processing platform that accepts various payment methods, including credit and debit cards.
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Klarna:</span> Klarna offers flexible payment options, allowing you to pay for purchases over time.
            </p>
          </div>
        </section>

        {/* Refunds Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">5. Refunds and Returns</h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              <span className="font-medium">Services:</span> Refunds for services are not provided unless required by law.
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Products:</span> Products can be returned within 14 days of receipt, if unused and in original packaging.
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Return Shipping Costs:</span> The buyer is responsible for return shipping costs.
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Faulty Products:</span> Contact us within 14 days for faulty or misdescribed products.
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Contact Information</h2>
          <p className="text-lg text-gray-700 mb-6">
            For any questions regarding these Terms and Conditions, please contact us at:
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