import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Facebook, Instagram, Twitter, ChevronDown, Mail, MapPin, Menu, X } from 'lucide-react';
import LogoImage from './LogoImage';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isTherapiesOpen, setIsTherapiesOpen] = React.useState(false);
  const [isShopOpen, setIsShopOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = React.useState(false);

  const therapies = [
    {
      name: "Neuropuncture",
      path: "neuropuncture"
    },
    {
      name: "Acupuncture",
      path: "acupuncture"
    },
    {
      name: "German Auricular Medicine",
      path: "german-auricular-medicine"
    },
    {
      name: "Massage",
      path: "massage"
    },
    {
      name: "Chinese Fire Cupping",
      path: "chinese-fire-cupping"
    },
    {
      name: "Reflexology",
      path: "reflexology"
    },
    {
      name: "Women's Health",
      path: "womens-health"
    },
    {
      name: "Frequency Healing",
      path: "frequency-healing"
    }
  ];

  const shopItems = [
    {
      name: "Shop",
      path: "/shop"
    },
    {
      name: "Gift Cards",
      path: "/gift-cards"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <div className="flex items-center">
                <LogoImage />
              </div>
              <div className="hidden md:flex items-center space-x-8 ml-10">
                <Link to="/about" className="text-yellow-600 hover:text-yellow-700 font-medium">About Us</Link>
                <div className="relative group">
                  <button
                    className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center"
                    onMouseEnter={() => setIsTherapiesOpen(true)}
                    onClick={() => setIsTherapiesOpen(!isTherapiesOpen)}
                  >
                    Therapies
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div
                    className={`absolute z-50 mt-2 w-64 bg-white rounded-lg shadow-xl transition-all duration-200 ${
                      isTherapiesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                    onMouseLeave={() => setIsTherapiesOpen(false)}
                  >
                    <div className="py-2">
                      {therapies.map((therapy, index) => (
                        <Link
                          key={index}
                          to={`/therapy/${therapy.path}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                          onClick={() => setIsTherapiesOpen(false)}
                        >
                          {therapy.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to="/clinic" className="text-yellow-600 hover:text-yellow-700 font-medium">Dr VJ's Clinic</Link>
                <Link to="/acugraph" className="text-yellow-600 hover:text-yellow-700 font-medium">Acugraph</Link>
                
                {/* Shop Dropdown Menu */}
                <div className="relative group">
                  <button
                    className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center"
                    onMouseEnter={() => setIsShopOpen(true)}
                    onClick={() => setIsShopOpen(!isShopOpen)}
                  >
                    Shop
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  <div
                    className={`absolute z-50 mt-2 w-40 bg-white rounded-lg shadow-xl transition-all duration-200 ${
                      isShopOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                    onMouseLeave={() => setIsShopOpen(false)}
                  >
                    <div className="py-2">
                      {shopItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                          onClick={() => setIsShopOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 font-semibold">
                  Login
                </button>
                <a href="tel:01513525605" className="flex items-center text-yellow-600 hover:text-yellow-700">
                  <Phone className="h-5 w-5 mr-2" />
                  0151 352 5605
                </a>
              </div>
              {/* Mobile menu button */}
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                onClick={() => setIsTherapiesOpen(!isTherapiesOpen)}
              >
                Therapies
                <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isTherapiesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTherapiesOpen && (
                <div className="pl-4">
                  {therapies.map((therapy, index) => (
                    <Link
                      key={index}
                      to={`/therapy/${therapy.path}`}
                      className="block px-3 py-2 text-base text-gray-700 hover:text-yellow-700 hover:bg-yellow-50"
                      onClick={() => {
                        setIsTherapiesOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {therapy.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/clinic"
              className="block px-3 py-2 rounded-md text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dr VJ's Clinic
            </Link>
            <Link
              to="/acugraph"
              className="block px-3 py-2 rounded-md text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Acugraph
            </Link>
            
            {/* Mobile Shop Menu */}
            <div className="relative">
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
              >
                Shop
                <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isShopMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isShopMenuOpen && (
                <div className="pl-4">
                  {shopItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="block px-3 py-2 text-base text-gray-700 hover:text-yellow-700 hover:bg-yellow-50"
                      onClick={() => {
                        setIsShopMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-3 py-2">
              <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 font-semibold mb-2">
                Login
              </button>
              <a
                href="tel:01513525605"
                className="flex items-center text-yellow-600 hover:text-yellow-700"
              >
                <Phone className="h-5 w-5 mr-2" />
                0151 352 5605
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Contact Us</h3>
              <div className="space-y-4">
                <a 
                  href="tel:01513525605" 
                  className="flex items-center hover:text-yellow-400 transition-colors duration-200"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  <span>0151 352 5605</span>
                </a>
                <a 
                  href="mailto:kindness@maitri-liverpool.co.uk"
                  className="flex items-center hover:text-yellow-400 transition-colors duration-200"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span>kindness@maitri-liverpool.co.uk</span>
                </a>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <address className="not-italic">
                    127-131 Picton Road<br />
                    Wavertree<br />
                    Liverpool<br />
                    L15 4LG
                  </address>
                </div>
              </div>
              {/* Map */}
              <div className="mt-4 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-2.934642%2C53.398581%2C-2.931203%2C53.400581&amp;layer=mapnik&amp;marker=53.39958099999999%2C-2.932923"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Maitri Liverpool Location"
                ></iframe>
                <a 
                  href="https://www.openstreetmap.org/?mlat=53.39958&amp;mlon=-2.932923#map=18/53.39958/-2.932923"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-yellow-400 hover:text-yellow-300 mt-1 inline-block"
                >
                  View Larger Map
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-yellow-400 transition-colors duration-200"><Facebook /></a>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-200"><Instagram /></a>
                <a href="#" className="hover:text-yellow-400 transition-colors duration-200"><Twitter /></a>
              </div>
              
              {/* Affiliates Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Our Affiliates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href="https://www.acupuncturesociety.org.uk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg flex flex-col items-center justify-center"
                  >
                    <img 
                      src="https://www.acupuncturesociety.org.uk/logo/as_logo.png" 
                      alt="The Acupuncture Society" 
                      className="h-12 w-auto"
                    />
                    <span className="text-navy-900 text-xs mt-2 text-center">The Acupuncture Society</span>
                  </a>
                  <a 
                    href="https://neuropuncture.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg flex flex-col items-center justify-center"
                  >
                    <img 
                      src="https://i.postimg.cc/PxNx5bqp/Neuropuncture-logomark-color.png" 
                      alt="Neuropuncture Inc" 
                      className="h-12 w-auto"
                    />
                    <span className="text-navy-900 text-xs mt-2 text-center">Neuropuncture Inc., USA</span>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-yellow-400 transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-yellow-400 transition-colors duration-200">Terms & Conditions</Link></li>
                <li><Link to="/cookies" className="hover:text-yellow-400 transition-colors duration-200">Cookie Policy</Link></li>
                <li className="mt-6 text-xs"><Link to="/admin/login" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>© 2024 MAITRI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}