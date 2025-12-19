import { useState, useEffect } from "react";

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

/**
 * Componente de Slider de Preço
 */
export function PriceSlider({ minPrice, maxPrice, onPriceChange }: PriceSliderProps) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value <= localMax) {
      setLocalMin(value);
      onPriceChange(value, localMax);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= localMin) {
      setLocalMax(value);
      onPriceChange(localMin, value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Faixa de Preço
        </label>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold text-green-600">
            R$ {localMin.toFixed(2)}
          </span>
          <span className="text-gray-400">-</span>
          <span className="text-sm font-semibold text-green-600">
            R$ {localMax.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Slider Mínimo */}
      <div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.01"
          value={localMin}
          onChange={handleMinChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <p className="text-xs text-gray-500 mt-1">Preço Mínimo</p>
      </div>

      {/* Slider Máximo */}
      <div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.01"
          value={localMax}
          onChange={handleMaxChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <p className="text-xs text-gray-500 mt-1">Preço Máximo</p>
      </div>
    </div>
  );
}
