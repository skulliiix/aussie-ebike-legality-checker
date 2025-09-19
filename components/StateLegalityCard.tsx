import React from 'react';
import type { StateLegality } from '../types';
import { getOfficialSource } from '../services/lawService';

interface StateLegalityCardProps {
  legalityInfo: StateLegality;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const StateLegalityCard: React.FC<StateLegalityCardProps> = ({ legalityInfo }) => {
  const { state, reason, usageType } = legalityInfo;
  
  // Get the state code from the state name
  const stateCodeMap: { [key: string]: string } = {
    'New South Wales': 'NSW',
    'Victoria': 'VIC',
    'Queensland': 'QLD',
    'South Australia': 'SA',
    'Western Australia': 'WA',
    'Tasmania': 'TAS',
    'Northern Territory': 'NT',
    'Australian Capital Territory': 'ACT'
  };
  
  const stateCode = stateCodeMap[state] || state;
  const officialSource = getOfficialSource(stateCode);
  
  const getStatusDetails = () => {
    switch (usageType) {
      case 'Road Legal (Unlicensed)':
        return {
          cardClasses: 'bg-green-900/50 border-green-500/50',
          statusClasses: 'bg-green-500/80 text-white',
          icon: <CheckIcon className="w-6 h-6 text-green-300" />,
          text: 'Road Legal',
        };
      case 'Requires License/Registration':
        return {
          cardClasses: 'bg-yellow-900/50 border-yellow-500/50',
          statusClasses: 'bg-yellow-500/80 text-black',
          icon: <WarningIcon className="w-6 h-6 text-yellow-300" />,
          text: 'Needs Registration',
        };
      case 'Off-Road / Private Property Only':
         return {
          cardClasses: 'bg-red-900/50 border-red-500/50',
          statusClasses: 'bg-red-500/80 text-white',
          icon: <XCircleIcon className="w-6 h-6 text-red-300" />,
          text: 'Off-Road Only',
        };
      default:
        return {
            cardClasses: 'bg-gray-700/50 border-gray-500/50',
            statusClasses: 'bg-gray-500/80 text-white',
            icon: null,
            text: 'Unknown',
        }
    }
  };

  const { cardClasses, statusClasses, icon, text } = getStatusDetails();

  return (
    <div className={`border rounded-lg p-4 flex flex-col shadow-lg transition-transform hover:scale-105 ${cardClasses}`}>
      <div className="mb-2">
        <h3 className="text-xl font-bold text-white mb-2">{state}</h3>
        <div className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-2 ${statusClasses} w-fit`}>
          {icon}
          <span>{text}</span>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-3">{reason}</p>
      
      {/* Law source information */}
      <div className="mt-auto pt-2 border-t border-gray-600/50">
        {officialSource && (
          <div>
            <a 
              href={officialSource} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-sky-400 hover:text-sky-300 underline"
            >
              Official Law Source
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateLegalityCard;
