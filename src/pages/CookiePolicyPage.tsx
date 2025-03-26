import React from 'react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Cookie Policy</h1>
        
        {/* Overview Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Overview</h2>
          <p className="text-lg text-gray-700 mb-6">
            Maitri Liverpool Limited ("us", "we", or "our") uses cookies on the www.maitri-liverpool.co.uk website (the "Service"). By using the Service, you consent to the use of cookies.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our Cookies Policy explains what cookies are, how we use cookies, how third-parties we may partner with may use cookies on the Service, your choices regarding cookies and further information about cookies.
          </p>
        </section>

        {/* What are Cookies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">What are cookies?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
          </p>
        </section>

        {/* How We Use Cookies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">How Maitri Liverpool Limited uses cookies</h2>
          <p className="text-lg text-gray-700 mb-6">
            When you use and access the Service, we may place a number of cookies files in your web browser.
          </p>
          <p className="text-lg text-gray-700 mb-6">We use cookies for the following purposes:</p>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-6">
            <li>To enable certain functions of the Service</li>
            <li>To provide analytics</li>
            <li>To store your preferences</li>
          </ul>
          <p className="text-lg text-gray-700 mb-6">
            We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
          </p>
          <ul className="space-y-4 text-lg text-gray-700 mb-6">
            <li><span className="font-medium">Essential cookies.</span> We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
            <li><span className="font-medium">Preferences cookies.</span> We may use preferences cookies to remember information that changes the way the Service behaves or looks.</li>
            <li><span className="font-medium">Analytics cookies.</span> We may use analytics cookies to track information how the Service is used so that we can make improvements.</li>
          </ul>
        </section>

        {/* Third-party Cookies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Third-party cookies</h2>
          <p className="text-lg text-gray-700 mb-6">
            In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
          </p>
        </section>

        {/* Your Choices Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-900 mb-4">Your choices regarding cookies</h2>
          <p className="text-lg text-gray-700 mb-6">
            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
          </p>
        </section>
      </div>
    </div>
  );
}