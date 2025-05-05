import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Mood } from '../../types';
import { useMapStore } from '../../store/useMapStore';
import { cn } from '@/lib/utils';

// List of all supported moods
const allMoods: Mood[] = [
  '🍰 Cute Cafes',
  '🌇 Sunset Spots', 
  '🖼️ Aesthetic Museums',
  '🛍️ Indie Shops',
  '🍜 Hidden Food Gems',
  '🌳 Nature Escapes',
  '📸 Instagram Spots',
  '✨ Hidden Gems'
];

const MoodFilter: React.FC = () => {
  const { selectedMoods, toggleMood, clearMoods } = useMapStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="relative w-full overflow-hidden bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-md">
      {/* Header and controls */}
      <div 
        className="flex justify-between items-center px-4 py-3 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-purple-700">Filter by vibe</h3>
          {selectedMoods.length > 0 && (
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
              {selectedMoods.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {selectedMoods.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearMoods();
              }}
              className="text-xs text-pink-500 font-medium hover:text-pink-600"
            >
              Clear
            </button>
          )}
          {isCollapsed ? (
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      
      {/* Scrollable mood chips */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex space-x-2 overflow-x-auto pb-3 px-4 scrollbar-hide">
              {allMoods.map((mood) => (
                <MoodChip 
                  key={mood}
                  mood={mood}
                  isSelected={selectedMoods.includes(mood)}
                  onToggle={() => toggleMood(mood)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MoodChipProps {
  mood: Mood;
  isSelected: boolean;
  onToggle: () => void;
}

const MoodChip: React.FC<MoodChipProps> = ({ mood, isSelected, onToggle }) => {
  const emoji = mood.split(' ')[0];
  const label = mood.split(' ').slice(1).join(' ');
  
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        "flex items-center space-x-1 py-1.5 px-3 rounded-full whitespace-nowrap text-sm transition-colors",
        isSelected 
          ? "bg-purple-500 text-white font-medium shadow-md" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
};

export default MoodFilter;