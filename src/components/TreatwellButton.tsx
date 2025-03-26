import React from 'react';

declare global {
  interface Window {
    wahanda: {
      openOnlineBookingWidget: (url: string) => void;
    };
  }
}

export default function TreatwellButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.wahanda) {
      window.wahanda.openOnlineBookingWidget("https://widget.treatwell.co.uk/place/467843/menu/");
    }
  };

  return (
    <a 
      href="https://www.treatwell.co.uk/" 
      id="wahanda-online-booking-widget"
      onClick={handleClick}
      className="bg-yellow-600 text-white px-8 py-4 rounded-md hover:bg-yellow-700 transition-colors duration-150 inline-flex items-center text-lg font-medium"
    >
      <span>Book Now</span>
    </a>
  );
}