import { useState, useEffect } from "react";
import diamond from "./assets/diamond.jpg"; // Represents a full stack
import grass from "./assets/grassBlock.jpg"; // Represents leftover blocks

function StackCalculator() {
  const [stack, setStack] = useState("");
  const [result, setResult] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [visuals, setVisuals] = useState({ fullStacks: 0, leftover: 0 });
  const [loadedImages, setLoadedImages] = useState({}); // track loaded images

  const MAX_SLOTS = 64; // maximum number of images to display

  // Preload images
  useEffect(() => {
    [diamond, grass].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleCalculate = (e) => {
    e.preventDefault();
    const numStack = Number(stack);

    if (!Number.isInteger(numStack) || numStack <= 0) {
      setResult("Please enter a valid positive integer");
      setVisuals({ fullStacks: 0, leftover: 0 });
      setIsVisible(true);
      return;
    }

    const stackSize = 64;
    const fullStacksCount = Math.floor(numStack / stackSize);
    const leftoverBlocks = numStack % stackSize;

    // Show result immediately
    setResult(`You need ${fullStacksCount} full stacks and ${leftoverBlocks} blocks.`);
    setVisuals({ fullStacks: fullStacksCount, leftover: leftoverBlocks });
    setIsVisible(true);
    setStack("");
  };

  // Render inventory slots with fade-in effect
  const renderSlots = (num, image, size = 48) => {
    const displayNum = Math.min(num, MAX_SLOTS); // limit the number of images
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {Array(displayNum)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-400 rounded-sm flex items-center justify-center"
              style={{ width: size, height: size }}
            >
              <img
                src={image}
                alt="block"
                style={{
                  width: size - 4,
                  height: size - 4,
                  backgroundColor: "#ccc",
                  opacity: loadedImages[`${image}-${idx}`] ? 1 : 0,
                  transition: "opacity 0.3s ease-in",
                }}
                loading="lazy"
                onLoad={() => setLoadedImages((prev) => ({ ...prev, [`${image}-${idx}`]: true }))}
              />
            </div>
          ))}
        {num > MAX_SLOTS && <p className="text-sm text-gray-600 mt-1">+{num - MAX_SLOTS} more</p>}
      </div>
    );
  };

  return (
    <div className="minecraft-text flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white border-4 border-gray-300 rounded-xl p-6 sm:p-8 md:p-10 shadow-md w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl p-4 mb-4 text-center bg-green-600 rounded-xl text-amber-50">
          Stack Calculator
        </h1>
        <p className="mb-4 sm:mb-5 text-center text-base sm:text-lg md:text-xl">
          Calculate how many stacks you need with your very own blocks!
        </p>

        <form onSubmit={handleCalculate} className="flex flex-col gap-3 sm:gap-4 mb-4">
          <label className="text-center text-lg sm:text-xl md:text-2xl">Amount:</label>
          <input
            className="border-2 border-gray-300 rounded-lg p-2 text-center text-base sm:text-lg md:text-xl w-full"
            type="number"
            value={stack}
            onChange={(e) => {
              setStack(e.target.value);
              setIsVisible(false);
            }}
            placeholder="Enter a positive integer"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 w-full sm:w-auto mx-auto"
          >
            Calculate
          </button>
        </form>

        {isVisible && (
          <div className="text-center mt-4">
            <p
              className="bg-green-50 text-base sm:text-lg md:text-xl text-center text-gray-700 border-2 border-green-200 rounded-lg p-3"
              aria-live="polite"
            >
              {result}
            </p>

            {/* Full stacks */}
            {renderSlots(visuals.fullStacks, diamond, 48)}

            {/* Leftover blocks */}
            {renderSlots(visuals.leftover, grass, 36)}
          </div>
        )}
      </div>
    </div>
  );
}

export default StackCalculator;
