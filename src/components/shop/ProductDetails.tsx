import React from 'react';
import { Check } from 'lucide-react';
import productImage from '../../../public/product_image.jpg'

interface ProductDetailsProps {
  symptoms: string[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ symptoms }) => {
  return (
    <div>
      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Chakra Model Harmonizer</h2>
        <p className="text-lg text-gray-700 mb-6">
          Advanced Protection Technology with Scalar Wave Frequencies
        </p>
        <div className="prose prose-lg text-gray-700 mb-6">
          <p>
            Placing a Harmonix Resonator in a room generates a healing scalar field, creating an environment that supports deep relaxation and restoration. By tuning the surrounding frequency to 7.83Hz—the Schumann Resonance, which aligns with human biology—it helps correct brain and body imbalances naturally.
          </p>
          <p className="mt-4">
            However, for 7.83Hz to benefit the body, it must exist within a zero-point electromagnetic field (scalar energy field). Harmonix Scalar Generators achieve this using a researched and tested scalar antenna along with our proprietary DNA-shaped coil antenna infused with chakra frequencies.
          </p>
          <p className="mt-4">
            This emitted scalar energy produces a zero-point energy field of unlimited potential, neutralizing disruptive environmental frequencies. By eliminating these chaotic signals, the body's cells can function optimally, leveraging their innate intelligence for self-healing and overall well-being.
          </p>
        </div>
        <img
          src={productImage}
          alt="Chakra Model Harmonizer"
          className="rounded-lg shadow-lg w-2/5"
        />
      </div>

      {/* Perfect for Those Who */}
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-6">Perfect for Those Who:</h3>
        <ul className="space-y-3">
          {symptoms.map((symptom, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <span className="text-gray-700">{symptom}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails; 