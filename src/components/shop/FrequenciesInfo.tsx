import React from 'react';

interface Frequency {
  hz: string;
  description: string;
}

interface FrequenciesInfoProps {
  frequencies: Frequency[];
}

const FrequenciesInfo: React.FC<FrequenciesInfoProps> = ({ frequencies }) => {
  return (
    <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
      <h3 className="text-xl font-semibold mb-6">Chakra Model Frequencies</h3>
      <div className="grid gap-4">
        {frequencies.map((freq, index) => (
          <div key={index} className="flex items-center">
            <span className="font-medium text-yellow-600 w-24">{freq.hz}</span>
            <span className="text-gray-700">{freq.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrequenciesInfo; 