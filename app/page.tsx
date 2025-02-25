"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"


type MachinePricing = {
  basePrice: number
  extraPricePerThousand: number
}

type PricingData = {
  pricingData: {
    [machine: string]: {
      [printType: string]: MachinePricing
    }
  }
}


export default function Home() {
  const [machines, setMachines] = useState<PricingData>({ pricingData: {} })
  const [selectedMachine, setSelectedMachine] = useState("")
  const [selectedPrintType, setSelectedPrintType] = useState("")
  const [quantity, setQuantity] = useState(1000)
  const [wastage, setWastage] = useState(200)
  const [price, setPrice] = useState(0)
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
 

  // ✅ Board Pricing Data
  const boardPrices = {
    artPaper: {
      sizes: {
        "20x30": {
          "80GSM": 2.72,
          "90GSM": 2.98,
          "100GSM": 3.3,
          "130GSM": 4.15,
          "170GSM": 5.43,
          "220GSM": 7.03,
          "250GSM": 7.99,
          "300GSM": 9.58,
          "350GSM": 11.35,
        },
        "23x36": {
          "80GSM": 3.73,
          "90GSM": 4.1,
          "100GSM": 4.57,
          "130GSM": 5.73,
          "170GSM": 7.49,
          "220GSM": 9.7,
          "250GSM": 11.0,
          "300GSM": 13.22,
          "350GSM": 15.65,
        },
        "25x36": {
          "80GSM": 4.06,
          "90GSM": 4.46,
          "100GSM": 4.96,
          "130GSM": 6.22,
          "170GSM": 8.14,
          "220GSM": 10.54,
          "250GSM": 11.98,
          "300GSM": 14.37,
          "350GSM": 17.02,
        },
      },
    },
    maplithio: {
      sizes: {
        "20x30": { "60GSM": 1.9, "70GSM": 2.18, "80GSM": 2.48, "90GSM": 2.79, "100GSM": 3.1, "120GSM": 3.72 },
        "23x36": { "60GSM": 2.63, "70GSM": 2.97, "80GSM": 3.42, "90GSM": 3.85, "100GSM": 4.37, "120GSM": 5.11 },
        "25x36": { "60GSM": 3.25, "70GSM": 3.72, "80GSM": 4.18, "90GSM": 4.65, "100GSM": 5.57 },
        "17x27": { "60GSM": 1.66, "70GSM": 1.9, "80GSM": 2.13, "90GSM": 2.37, "100GSM": 2.84 },
      },
    },
    cyberXL: {
      sizes: {
        "31.5x41.5": { "300GSM": 22.01, "350GSM": 25.38, "400GSM": 29.00 },
        "25x41.5": { "300GSM": 17.47, "350GSM": 20.15, "400GSM": 23.02 },
        "25x36": { "300GSM": 15.15, "350GSM": 17.48, "400GSM": 19.97 },
        "23x36": { "300GSM": 13.94, "350GSM": 16.02, "400GSM": 18.38 },
      },
    },
    whiteBack: {
      sizes: {
        "31.5x41.5": { "350GSM": 18.89, "300GSM": 16.19 },
        "25x41.5": { "350GSM": 15.0, "300GSM": 12.85 },
        "25x36": { "350GSM": 13.0, "300GSM": 11.15 },
        "23x36": { "350GSM": 11.97, "300GSM": 10.26 },
      },
    },
    grayBack: {
      sizes: {
        "31.5x41.5": { "230GSM": 11.05, "250GSM": 12.02, "300GSM": 13.66 },
        "25x41.5": { "230GSM": 8.78, "250GSM": 9.54, "300GSM": 10.84 },
        "25x36": { "230GSM": 7.61, "250GSM": 8.28, "300GSM": 9.4 },
        "23x36": { "230GSM": 7.02, "250GSM": 7.62, "300GSM": 8.65 },
      },
    },
    stickerPaper: {
      sizes: {
        "20x30": { StayOn: 12.0, StickOn: 11.5 },
        "18x25": { StayOn: 8.5, StickOn: 9.5 },
        "18x23": { StayOn: 8.15, StickOn: 9.0 },
        "23x36": { StayOn: 17.5, StickOn: 11.0 },
      },
    },
  }

  // Board Cost Calculation
  const [selectedSize, setSelectedSize] = useState("23 X 36") // Default to 23 X 36
  const [selectedGSM, setSelectedGSM] = useState("350")
  const [boardCost, setBoardCost] = useState(0)
  const [division, setDivision] = useState(1)
  const [selectedBoard, setSelectedBoard] = useState<keyof typeof boardPrices>("artPaper")
  const [customSize, setCustomSize] = useState("");
const [customPrice, setCustomPrice] = useState("");

// Check if the selected size exists
const availableSizes = Object.keys(boardPrices[selectedBoard].sizes);
const isCustomSize = !availableSizes.includes(selectedSize);

  // Coating Calculation
  const [coatingType, setCoatingType] = useState("Gloss")
  const [coatingHeight, setCoatingHeight] = useState(0)
  const [coatingWidth, setCoatingWidth] = useState(0)
  const [coatingPrice, setCoatingPrice] = useState(0)

  // Die Cost
  const [dieCost, setDieCost] = useState(500)

  

  // Cutting Cost
  const [cuttingType, setCuttingType] = useState("Metpet")
  const [cuttingCost, setCuttingCost] = useState(0)

  // Transport Cost
  const [transportCost, setTransportCost] = useState(2000)

  // Pasting Cost
  const [pastingType, setPastingType] = useState("Bottom Lock")
  const [ups, setUps] = useState(1)
  const [pastingCost, setPastingCost] = useState(0)
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    fetch(`https://quotation-backend-beta.vercel.app/api/get-pricing`)
      .then((res) => res.json())
      .then((data: PricingData) => {
        setMachines(data)
        if (Object.keys(data.pricingData).length > 0) {
          const firstMachine = Object.keys(data.pricingData)[0]
          setSelectedMachine(firstMachine)
          if (data.pricingData[firstMachine]) {
            setSelectedPrintType(Object.keys(data.pricingData[firstMachine])[0] || "")
          }
        }
      })
      .catch((error) => console.error("Error fetching pricing data:", error))
  }, [])

  

  useEffect(() => {
    if (machines.pricingData[selectedMachine] && machines.pricingData[selectedMachine][selectedPrintType]) {
      const { basePrice, extraPricePerThousand } = machines.pricingData[selectedMachine][selectedPrintType]

      let finalPrice
      if (quantity <= 3000) {
        finalPrice = basePrice
      } else {
        const extraUnits = Math.ceil((quantity - 3000) / 1000)
        finalPrice = basePrice + extraUnits * extraPricePerThousand
      }

      setPrice(finalPrice)
    }
  }, [selectedMachine, selectedPrintType, quantity, machines])

  useEffect(() => {
    if (!selectedBoard || !selectedSize || !selectedGSM || !division) return;
  
    let boardPricePerSheet = 0;
  
    // Check if the selected size exists in boardPrices
    if (selectedBoard in boardPrices) {
      const board = boardPrices[selectedBoard as keyof typeof boardPrices];
  
      // If the selected size is available
      if (selectedSize in board.sizes) {
        const sizeData = board.sizes[selectedSize as keyof typeof board.sizes];
  
        // If the selected GSM is available
        if (selectedGSM in sizeData) {
          boardPricePerSheet = sizeData[selectedGSM as keyof typeof sizeData] ?? 0;
        }
      }
    }
  
    // If custom size is selected, use custom price
    if (!boardPricePerSheet && customPrice) {
      boardPricePerSheet = parseFloat(customPrice);
    }
  
    // Calculate total cost
    const costPerDivision = boardPricePerSheet / division;
    const totalBoardCost = costPerDivision * (quantity + wastage);
  
    setBoardCost(totalBoardCost);
  }, [selectedBoard, selectedSize, selectedGSM, quantity, division, wastage, customPrice]);
  
  const [punchingType, setPunchingType] = useState("Paper Board");
  const [punchingCost, setPunchingCost] = useState(500);
  
  useEffect(() => {
    const calculatePunchingCost = (quantity: number) => {
      let cost = 500; // Base cost for up to 1100 sheets
  
      if (quantity > 1100) cost = 750; // 1101 - 1500 sheets
      if (quantity > 1500) cost = 1000; // 1501 - 2100 sheets
      if (quantity > 2100) cost += Math.ceil((quantity - 2100) / 600) * 250; // ₹250 per extra 600 sheets
  
      return cost;
    };
  
    const totalQuantity = quantity + wastage; // Include wastage in calculation
    const baseCost = calculatePunchingCost(totalQuantity);
  
    // Apply different rates for Paper Board & E-Flute
    const finalCost = punchingType === "Paper Board" ? baseCost : baseCost * 1;
  
    setPunchingCost(finalCost);
  }, [quantity, punchingType, wastage]);
  
  
  




  useEffect(() => {
    let cost = 0
    if (cuttingType === "Metpet") {
      cost = quantity <= 3000 ? 3000 : (3000 / quantity) * 3000
    } else if (cuttingType === "4 Color") {
      cost = quantity <= 2000 ? 2000 : (2000 / quantity) * 2000
    }
    setCuttingCost(cost)
  }, [quantity, cuttingType])

  
 
  

  useEffect(() => {
    fetch("https://quotation-backend-beta.vercel.app/api/get-pricing")
      .then((res) => res.json())
      .then((data: PricingData) => {
        setMachines(data)
        if (data.pricingData[selectedMachine]) {
          setSelectedPrintType(Object.keys(data.pricingData[selectedMachine])[0] || "")
        }
      })
  }, [selectedMachine]) // Added selectedMachine as a dependency

  useEffect(() => {
    if (machines.pricingData[selectedMachine] && machines.pricingData[selectedMachine][selectedPrintType]) {
      const { basePrice, extraPricePerThousand } = machines.pricingData[selectedMachine][selectedPrintType]

      let finalPrice
      if (quantity <= 3000) {
        finalPrice = basePrice
      } else {
        const extraUnits = Math.ceil((quantity - 3000) / 1000)
        finalPrice = basePrice + extraUnits * extraPricePerThousand
      }

      setPrice(finalPrice)
    }
  }, [selectedMachine, selectedPrintType, quantity, machines])
  const [metpetPrice, setMetpetPrice] = useState(0)
  const [baseCoatingCost, setBaseCoatingCost] = useState(0)
  const calculateCoatingCost = () => {
    let rate = 0;
    if (coatingType === "Gloss") rate = 0.38;
    else if (coatingType === "Matt") rate = 0.45;
    else if (coatingType === "Texture UV") rate = 0.8;
    else if (coatingType === "Metpet") rate = 1.45;
    else if (coatingType === "3d") rate = 2.25;

    const totalQuantity = quantity + wastage;

    // Step 1: Multiply width, height, and rate
    let costPerSheet = coatingHeight * coatingWidth * rate;

    // Step 2: Divide by 100
    costPerSheet /= 100;

    // Step 3: Take only the integer part (truncate decimals)
    costPerSheet = Math.floor(costPerSheet * 100) / 100; // Ensures only two decimal places

    // Step 4: Multiply by total quantity
    const cost = costPerSheet * totalQuantity;

    setCoatingPrice(cost);

    // If 3D is selected, calculate Metpet price separately
    if (coatingType === "3d") {
        let metpetCostPerSheet = (coatingHeight * coatingWidth * 0.8) / 100;
        metpetCostPerSheet = Math.floor(metpetCostPerSheet * 100) / 100; // Ensures only two decimal places
        const metpetCost = metpetCostPerSheet * totalQuantity;

        setMetpetPrice(metpetCost);

        // Base coating cost: ₹1 per sheet (including wastage)
        setBaseCoatingCost(totalQuantity * 1);
    } else {
        setMetpetPrice(0);
        setBaseCoatingCost(0);
    }
};


  useEffect(() => {
    let rate = 0

    if (pastingType === "Bottom Lock") rate = 0.45
    else if (pastingType === "Side Pasting") rate = 0.25

    setPastingCost(ups * (quantity) * rate)
  }, [ups, quantity, wastage, pastingType])
  const [totalCost, setTotalCost] = useState(0)
  const [percentage, setPercentage] = useState(16) // Default 16%

  useEffect(() => {
    setTotalCost(
      boardCost +
        price +
        coatingPrice +
        dieCost +
        punchingCost +
        pastingCost +
        transportCost +
        baseCoatingCost +
        metpetPrice,
    )
  }, [boardCost, price, coatingPrice, dieCost, punchingCost, pastingCost, transportCost, baseCoatingCost, metpetPrice])

  const finalCost = ((totalCost / (quantity * ups)) * (1 + percentage / 100)).toFixed(2)

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
    
    // Apply theme immediately
    if (savedTheme) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode !== null) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", darkMode.toString());
    }
  }, [darkMode]);

  // Prevent rendering until the theme is loaded
  if (darkMode === null) return null;



  //---------------------------------------------------------------------------------------------------------------------------------------------///





  
  return (
    
      
    <div className="p-4 md:p-6 bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text min-h-screen">
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
      >
        <AnimatePresence mode="wait" initial={false}>
          {darkMode ? (
            <motion.div
              key="sun"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-6 w-6 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <div className="flex flex-col items-center justify-center text-center">
  <motion.img
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    src="/Logo1.png"
    alt="Company Logo"
    className="h-20 block dark:hidden"
  />
  <motion.img
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    src="/Logo2.png"
    alt="Company Logo Dark Mode"
    className="h-20 hidden dark:block"
  />
</div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl md:text-5xl font-bold text-center py-6 md:py-12 text-gray-900 dark:text-gray-100"
      >
        Offset Quotation Maker
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-6 md:items-stretch">
        <div className="w-full md:w-2/5 bg-white dark:bg-dark-surface shadow-lg rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Board Selection</h2>

          <label className="block text-gray-700 dark:text-dark-text">Board Type:</label>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value as keyof typeof boardPrices)}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
          >
            {Object.keys(boardPrices).map((board) => (
              <option key={board} value={board}>
                {board}
              </option>
            ))}
          </select>

          <label className="block text-gray-700 dark:text-dark-text mt-4">Board Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            disabled={!selectedBoard}
          >
            <option value="">Select Size</option>
            {selectedBoard &&
              Object.keys(boardPrices[selectedBoard].sizes).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
              <option value="custom">Custom Size</option>
          </select>

          {/* Custom Size Input
    {selectedSize === "custom" && (
      <input
        type="text"
        placeholder="Enter Custom Size"
        value={customSize}
        onChange={(e) => setCustomSize(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full mt-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
      />
    )} */}

          {selectedSize && selectedBoard && (
            <>
              <label className="block text-gray-700 dark:text-dark-text mt-4">GSM:</label>
              <select
                value={selectedGSM}
                onChange={(e) => setSelectedGSM(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
                disabled={!selectedSize}
              >
                <option value="">Select GSM</option>
                {Object.keys(
                  boardPrices[selectedBoard as keyof typeof boardPrices]?.sizes?.[
                    selectedSize as keyof (typeof boardPrices)[typeof selectedBoard]["sizes"]
                  ] || {},
                ).map((gsm) => (
                  <option key={gsm} value={gsm}>
                    {gsm}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Custom Price Input */}
    {selectedSize === "custom" && (
      <div className="mt-4">
        <label className="block text-gray-700 dark:text-gray-300">Custom Price (₹):</label>
        <input
          type="number"
          placeholder="Enter Custom Price"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
        />
      </div>
    )}
    


          <div className=" mt-4 flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-fit">
            <button
              onClick={() => setDivision((prev) => Math.max(1, prev - 1))}
              className="px-3 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l-md text-gray-700 dark:text-dark-text"
            >
              −
            </button>
            <input
              type="number"
              value={division}
              onChange={(e) => setDivision(Number.parseInt(e.target.value) || 1)}
              className="w-16 text-center border-x border-gray-300 dark:border-gray-700 p-2 md:p-3 bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            />
            <button
              onClick={() => setDivision((prev) => prev + 1)}
              className="px-3 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l-md text-gray-700 dark:text-dark-text"
            >
              +
            </button>
          </div>

          <label className="block text-gray-700 dark:text-dark-text mt-4">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
          />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mt-4">
            Board Cost: ₹{boardCost ? boardCost.toFixed(2) : "0.00"}/-
          </h3>
        </div>

        <div className="w-full md:w-3/5 bg-white dark:bg-dark-surface shadow-md rounded-lg p-4 md:p-6 mt-6 md:mt-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Printing Cost Calculation</h2>

          <fieldset>
            <legend className="block text-gray-700 dark:text-dark-text">Machine:</legend>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(machines.pricingData).map((machine) => (
                <label key={machine} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={machine}
                    checked={selectedMachine === machine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="peer hidden"
                    />
                    <div className="h-5 w-5 rounded-full border-2 border-gray-400 dark:border-white peer-checked:border-black dark:peer-checked:border-white flex items-center justify-center transition-all duration-200">
                      {selectedMachine === machine && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white"></div>
                      )}
                    </div>
                    <span className="ml-2 text-gray-800 dark:text-gray-300">{machine}</span>
                  </label>
              ))}
            </div>
          </fieldset>

          {machines.pricingData[selectedMachine] && (
            <fieldset className="mt-4">
              <legend className="block text-gray-700 dark:text-dark-text">Printing Type:</legend>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(machines.pricingData[selectedMachine]).map((type) => (
                   <label key={type} className="inline-flex items-center cursor-pointer">
                   <input
                     type="radio"
                     value={type}
                     checked={selectedPrintType === type}
                     onChange={(e) => setSelectedPrintType(e.target.value)}
                     className="peer hidden"
                   />
                   <div className="h-5 w-5 rounded-full border-2 border-gray-400 dark:border-white peer-checked:border-black dark:peer-checked:border-white flex items-center justify-center">
                     {selectedPrintType === type && (
                       <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white"></div>
                     )}
                   </div>
                   <span className="ml-2 text-gray-800 dark:text-gray-300">{type.replace("_", " ")}</span>
                 </label>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="mt-4">
            {/* Quantity Input */}
            <label className="block text-gray-700 dark:text-dark-text">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 mb-4 rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            />
          </fieldset>
          {/* Wastage Input */}
          <label className="block text-gray-700 dark:text-dark-text">Wastage (Default: 200):</label>
          <input
            type="number"
            value={wastage}
            onChange={(e) => setWastage(Number.parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 mb-4 rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
          />

          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mt-4">
            Estimated Print Price: ₹{price}/-
          </h2>
        </div>
      </div>
{/* 
      <hr className="my-6" /> */}

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-2/5 bg-white dark:bg-dark-surface shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Coating & Lamination</h2>

          <fieldset>
            <legend className="block text-gray-700 dark:text-dark-text">Type:</legend>
            <div className="grid grid-cols-2 gap-2">
              {["Gloss", "Matt", "Texture UV", "Metpet", "3d"].map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={type}
                    checked={coatingType === type}
                    onChange={(e) => setCoatingType(e.target.value)}
                    className="peer hidden"
                    />
                    <div className="h-5 w-5 rounded-full border-2 border-gray-400 dark:border-white peer-checked:border-black dark:peer-checked:border-white flex items-center justify-center">
                      {coatingType === type && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white "></div>
                      )}
                    </div>
                    <span className="ml-2 text-gray-800 dark:text-gray-300">{type}</span>
                  </label>
                  ))}
            </div>
          </fieldset>

          <label className="block text-gray-700 dark:text-dark-text mt-4">Height (in):</label>
          <input
            type="number"
            onChange={(e) => setCoatingHeight(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
          />

          <label className="block text-gray-700 dark:text-dark-text mt-4">Width (in):</label>
          <input
            type="number"
            onChange={(e) => setCoatingWidth(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
          />
          <button
            onClick={calculateCoatingCost}
            className="bg-black dark:bg-gray text-white p-2 w-full mt-4 rounded"
          >
            Calculate Coating Cost
          </button>
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mt-4">
            Coating Cost: ₹{coatingPrice.toFixed(2)}/-
          </h3>
          {coatingType === "3d" && (
            <>
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mt-2">
                Metpet Cost: ₹{metpetPrice.toFixed(2)}/-
              </h3>
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mt-2">
                Base Coating Cost: ₹{baseCoatingCost.toFixed(2)}/-
              </h3>
            </>
          )}
        </div>

        <div className="w-full lg:w-3/5 flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/2 bg-white dark:bg-dark-surface shadow-md rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Die Cost</h2>

            <label className="block text-gray-700 dark:text-dark-text">Die Cost (Default: ₹500):</label>
            <input
              type="number"
              value={dieCost}
              onChange={(e) => setDieCost(Number.parseInt(e.target.value))}
              className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            />

            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mt-4">Die Cost: ₹{dieCost}/-</h3>
          </div>

          <div className="w-full sm:w-1/2 bg-white dark:bg-dark-surface shadow-md rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Punching</h2>

            <fieldset>
              <legend className="block text-gray-700 dark:text-dark-text">Select Punching Type:</legend>
              <div className="grid grid-cols-2 gap-2">
              <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="Paper Board"
                    checked={punchingType === "Paper Board"}
                    onChange={(e) => setPunchingType(e.target.value)}
                    className="peer hidden"
                  />
                  <div className="h-5 w-5 rounded-full border-2 border-gray-400 dark:border-white peer-checked:border-black dark:peer-checked:border-white flex items-center justify-center transition-all duration-200">
                    {punchingType === "Paper Board" && (
                      <div className="h-2.5 w-2.5 rounded-full  bg-black dark:bg-white"></div>
                    )}
                  </div>
                  <span className="ml-2 text-gray-800 dark:text-gray-300">
                    Paper Board 
                  </span>
                </label>
                
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="E-Flute"
                    checked={punchingType === "E-Flute"}
                    onChange={(e) => setPunchingType(e.target.value)}
                    className="peer hidden"
                  />
                  <div className="h-5 w-5 rounded-full border-2 border-gray-400dark:border-white peer-checked:border-black dark:peer-checked:border-white flex items-center justify-center transition-all duration-200">
                    {punchingType === "E-Flute" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white"></div>
                    )}
                  </div>
                  <span className="ml-2 text-gray-800 dark:text-gray-300">
                    E-Flute 
                  </span>
                </label>

              </div>
            </fieldset>
            

            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mt-4">
  Punching Cost: ₹{punchingCost.toLocaleString("en-IN")}/-
</h3>

          </div>
        </div>
      </div>

      {/* <hr className="my-6" /> */}

      <div className="flex flex-col sm:flex-row gap-6 mt-6">
        <div className="w-full sm:w-1/2 bg-white dark:bg-dark-surface shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Pasting</h2>

          <fieldset>
            <legend className="block text-gray-700 dark:text-dark-text">Pasting Type:</legend>
            <div className="grid grid-cols-2 gap-2">
            <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              value="Bottom Lock"
              checked={pastingType === "Bottom Lock"}
              onChange={(e) => setPastingType(e.target.value)}
              className="peer hidden"
            />
            <div className="h-5 w-5 rounded-full border-2 border-gray-400 dark:border-white peer-checked:border-black dark:peer-checked:border-white flex items-center justify-center transition-all duration-200">
              {pastingType === "Bottom Lock" && (
                <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white"></div>
              )}
            </div>
            <span className="ml-2 text-gray-800 dark:text-gray-300">Bottom Lock</span>
          </label>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              value="Side Pasting"
              checked={pastingType === "Side Pasting"}
              onChange={(e) => setPastingType(e.target.value)}
              className="peer hidden"
            />
            <div className="h-5 w-5 rounded-full border-2 border-gray-400dark:border-white peer-checked:border-black dark:peer-checked:border-white flex items-center justify-center transition-all duration-200">
              {pastingType === "Side Pasting" && (
                <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white"></div>
              )}
            </div>
            <span className="ml-2 text-gray-800 dark:text-gray-300">Side Pasting</span>
          </label>

            </div>
          </fieldset>
          <label className="block text-gray-700 dark:text-dark-text mt-4">Number of Ups:</label>
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-fit">
            <button
              onClick={() => setUps((prev) => Math.max(1, prev - 1))}
              className="px-3 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l-md text-gray-700 dark:text-dark-text"
            >
              -
            </button>
            <input
              type="number"
              value={ups}
              onChange={(e) => setUps(Number.parseInt(e.target.value))}
              className="w-16 text-center border-x border-gray-300 dark:border-gray-700 p-2 md:p-3 bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            />
            <button
              onClick={() => setUps((prev) => prev + 1)}
              className="px-3 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-r-md text-gray-700 dark:text-dark-text"
            >
              +
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mt-4">
            Pasting Cost: ₹{pastingCost.toFixed(2)}/-
          </h3>
        </div>

        <div className="w-full sm:w-1/2 bg-white dark:bg-dark-surface shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Transport</h2>

          <label className="block text-gray-700 dark:text-dark-text">Enter Transport Cost:</label>
          <input
            type="number"
            value={transportCost}
            onChange={(e) => setTransportCost(Number.parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
          />

          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mt-4">
            Transport Cost: ₹{transportCost}/-
          </h3>
          <div className="w-full sm:w-1/2 bg-white dark:bg-dark-surface shadow-md rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Final Cost Calculation</h2>

            <label className="block text-gray-700 dark:text-dark-text"></label>

            <button
              onClick={() => setPercentage((prev) => Math.max(prev - 1, 0))} // Prevents going below 0
              className="px-3 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l-md text-gray-700 dark:text-dark-text"
            >
              -
            </button>

            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-16 text-center border-x border-gray-300 dark:border-gray-700 p-2 md:p-3 bg-white dark:bg-dark-surface text-gray-800 dark:text-dark-text"
            />

            <button
              onClick={() => setPercentage((prev) => prev + 1)}
              className="px-3 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l-md text-gray-700 dark:text-dark-text"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* <hr className="my-6" /> */}

      <h3 className="text-3xl md:text-6xl font-bold text-center py-6 md:py-12 text-gray-900 dark:text-dark-text">
        Total Cost: ₹{totalCost.toFixed(2)}/-
      </h3>
      <h3 className="text-3xl md:text-6xl font-bold text-center py-6 md:py-12 text-gray-900 dark:text-dark-text">
        Final Cost: {finalCost}/-
      </h3>
      </motion.div>
    </div>
    
  )
  
}


function setMetpetPrice(metpetCost: number) {
  throw new Error("Function not implemented.")
}

