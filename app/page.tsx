"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

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
  const [darkMode, setDarkMode] = useState(false)

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
        "31.5x41.5": { "350GSM": 25.68, "300GSM": 22.01 },
        "25x41.5": { "350GSM": 20.38, "300GSM": 17.47 },
        "25x36": { "350GSM": 17.68, "300GSM": 15.15 },
        "23x36": { "350GSM": 16.27, "300GSM": 13.94 },
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

  // Coating Calculation
  const [coatingType, setCoatingType] = useState("Gloss")
  const [coatingHeight, setCoatingHeight] = useState(0)
  const [coatingWidth, setCoatingWidth] = useState(0)
  const [coatingPrice, setCoatingPrice] = useState(0)

  // Die Cost
  const [dieCost, setDieCost] = useState(500)

  // Punching Cost
  const [punchingType, setPunchingType] = useState("Paper Board")
  const [punchingCostPerThousand, setPunchingCostPerThousand] = useState(500)
  const [punchingCost, setPunchingCost] = useState(0)

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
    if (!boardPrices || !selectedBoard || !selectedSize || !selectedGSM) return

    // Ensure selectedBoard is a valid key
    if (!(selectedBoard in boardPrices)) return

    const board = boardPrices[selectedBoard as keyof typeof boardPrices]

    // Ensure selectedSize is a valid key
    if (!(selectedSize in board.sizes)) return

    const sizeData = board.sizes[selectedSize as keyof typeof board.sizes]

    // Ensure selectedGSM is a valid key
    if (!(selectedGSM in sizeData)) return

    const boardPricePerSheet = sizeData[selectedGSM as keyof typeof sizeData] ?? 0

    if (boardPricePerSheet) {
      const costPerDivision = boardPricePerSheet / division
      const totalBoardCost = costPerDivision * (quantity + wastage)
      setBoardCost(totalBoardCost)
    }
  }, [selectedBoard, selectedSize, selectedGSM, quantity, division, wastage])

  useEffect(() => {
    setPunchingCost(((quantity + wastage) / 1000) * punchingCostPerThousand)
  }, [quantity, punchingCostPerThousand, wastage]) // Added wastage as a dependency

  useEffect(() => {
    const rate = punchingType === "Paper Board" ? 500 : 1000
    setPunchingCost(((quantity + wastage) / 1000) * rate)
  }, [quantity, punchingType, wastage]) // Added wastage as a dependency

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
    setPunchingCostPerThousand(punchingType === "Paper Board" ? 500 : 1000)
  }, [punchingType])

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

  const calculateCoatingCost = () => {
    let rate = 0
    if (coatingType === "Gloss") rate = 0.38
    else if (coatingType === "Matt") rate = 0.45
    else if (coatingType === "Texture UV") rate = 0.8
    else if (coatingType === "Metpet") rate = 1.45

    const totalQuantity = quantity + wastage
    const cost = ((coatingHeight * coatingWidth * rate) / 100) * totalQuantity

    setCoatingPrice(cost)
  }

  useEffect(() => {
    const rate = pastingType === "Bottom Lock" ? 0.45 : 0.25
    setPastingCost(ups * quantity * rate)
  }, [ups, quantity, pastingType])

  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    setTotalCost(boardCost + price + coatingPrice + dieCost + punchingCost + pastingCost + transportCost)
  }, [boardCost, price, coatingPrice, dieCost, punchingCost, pastingCost, transportCost])

  const finalCost = ((totalCost / (quantity * ups)) * 1.16).toFixed(2)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {darkMode ? (
          <Sun className="h-6 w-6 text-yellow-500" />
        ) : (
          <Moon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        )}
      </button>
      <h1 className="text-3xl md:text-6xl font-bold text-center py-6 md:py-12 text-gray-900 dark:text-gray-100">
        Offset Quotation Maker
      </h1>

      <div className="flex flex-col md:flex-row gap-6 md:items-stretch">
        <div className="w-full md:w-2/5 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Board Selection</h2>

          <label className="block text-gray-700 dark:text-gray-300">Board Type:</label>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value as keyof typeof boardPrices)}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
          >
            {Object.keys(boardPrices).map((board) => (
              <option key={board} value={board}>
                {board}
              </option>
            ))}
          </select>

          <label className="block text-gray-700 dark:text-gray-300 mt-4">Board Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
            disabled={!selectedBoard}
          >
            <option value="">Select Size</option>
            {selectedBoard &&
              Object.keys(boardPrices[selectedBoard].sizes).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
          </select>

          {selectedSize && selectedBoard && (
            <>
              <label className="block text-gray-700 dark:text-gray-300 mt-4">GSM:</label>
              <select
                value={selectedGSM}
                onChange={(e) => setSelectedGSM(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
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

          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setDivision((prev) => Math.max(1, prev - 1))}
              className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md"
            >
              −
            </button>
            <input
              type="number"
              value={division}
              onChange={(e) => setDivision(Number.parseInt(e.target.value) || 1)}
              className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-20 text-center rounded-md bg-white dark:bg-gray-800"
            />
            <button
              onClick={() => setDivision((prev) => prev + 1)}
              className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md"
            >
              +
            </button>
          </div>

          <label className="block text-gray-700 dark:text-gray-300 mt-4">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
          />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Board Cost: ₹{boardCost ? boardCost.toFixed(2) : "0.00"}/-
          </h3>
        </div>

        <div className="w-full md:w-3/5 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6 mt-6 md:mt-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Printing Cost Calculation</h2>

          <fieldset>
            <legend className="block text-gray-700 dark:text-gray-300">Machine:</legend>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(machines.pricingData).map((machine) => (
                <label key={machine} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={machine}
                    checked={selectedMachine === machine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{machine}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {machines.pricingData[selectedMachine] && (
            <fieldset className="mt-4">
              <legend className="block text-gray-700 dark:text-gray-300">Printing Type:</legend>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(machines.pricingData[selectedMachine]).map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={type}
                      checked={selectedPrintType === type}
                      onChange={(e) => setSelectedPrintType(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{type.replace("_", " ")}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="mt-4">
            {/* Quantity Input */}
            <label className="block text-gray-700 dark:text-gray-300">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 mb-4 rounded-md bg-white dark:bg-gray-800"
            />
          </fieldset>
          {/* Wastage Input */}
          <label className="block text-gray-700 dark:text-gray-300">Wastage (Default: 200):</label>
          <input
            type="number"
            value={wastage}
            onChange={(e) => setWastage(Number.parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 mb-4 rounded-md bg-white dark:bg-gray-800"
          />

          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4">Estimated Print Price: ₹{price}/-</h2>
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-2/5 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Coating & Lamination</h2>

          <fieldset>
            <legend className="block text-gray-700 dark:text-gray-300">Type:</legend>
            <div className="grid grid-cols-2 gap-2">
              {["Gloss", "Matt", "Texture UV", "Metpet"].map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={type}
                    checked={coatingType === type}
                    onChange={(e) => setCoatingType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{type}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-gray-700 dark:text-gray-300 mt-4">Height (in):</label>
          <input
            type="number"
            onChange={(e) => setCoatingHeight(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
          />

          <label className="block text-gray-700 dark:text-gray-300 mt-4">Width (in):</label>
          <input
            type="number"
            onChange={(e) => setCoatingWidth(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
          />

          <button
            onClick={calculateCoatingCost}
            className="bg-blue-500 dark:bg-blue-700 text-white p-2 w-full mt-4 rounded"
          >
            Calculate Coating Cost
          </button>

          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-4">
            Coating Cost: ₹{coatingPrice.toFixed(2)}/-
          </h3>
        </div>

        <div className="w-full lg:w-3/5 flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Die Cost</h2>

            <label className="block text-gray-700 dark:text-gray-300">Die Cost (Default: ₹500):</label>
            <input
              type="number"
              value={dieCost}
              onChange={(e) => setDieCost(Number.parseInt(e.target.value))}
              className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
            />

            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-4">Die Cost: ₹{dieCost}/-</h3>
          </div>

          <div className="w-full sm:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Punching</h2>

            <fieldset>
              <legend className="block text-gray-700 dark:text-gray-300">Select Punching Type:</legend>
              <div className="grid grid-cols-2 gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Paper Board"
                    checked={punchingType === "Paper Board"}
                    onChange={(e) => setPunchingType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Paper Board (₹500 per 1000)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="E-Flute"
                    checked={punchingType === "E-Flute"}
                    onChange={(e) => setPunchingType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">E-Flute (₹1000 per 1000)</span>
                </label>
              </div>
            </fieldset>

            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-4">
              Punching Cost: ₹{punchingCost.toFixed(2)}/-
            </h3>
          </div>
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex flex-col sm:flex-row gap-6 mt-6">
        <div className="w-full sm:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pasting</h2>

          <fieldset>
            <legend className="block text-gray-700 dark:text-gray-300">Pasting Type:</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Bottom Lock"
                  checked={pastingType === "Bottom Lock"}
                  onChange={(e) => setPastingType(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Bottom Lock</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Side Pasting"
                  checked={pastingType === "Side Pasting"}
                  onChange={(e) => setPastingType(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Side Pasting</span>
              </label>
            </div>
          </fieldset>

          {/* Number of Ups with + / - buttons */}
          <label className="block text-gray-700 dark:text-gray-300 mt-4">Number of Ups:</label>
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-fit">
            <button
              onClick={() => setUps((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l-md text-gray-700 dark:text-gray-200"
            >
              -
            </button>
            <input
              type="number"
              value={ups}
              onChange={(e) => setUps(Number.parseInt(e.target.value))}
              className="w-16 text-center border-x border-gray-300 dark:border-gray-700 p-2 md:p-3 bg-white dark:bg-gray-800"
            />
            <button
              onClick={() => setUps((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-r-md text-gray-700 dark:text-gray-200"
            >
              +
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-4">
            Pasting Cost: ₹{pastingCost.toFixed(2)}/-
          </h3>
        </div>

        <div className="w-full sm:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Transport</h2>

          <label className="block text-gray-700 dark:text-gray-300">Enter Transport Cost:</label>
          <input
            type="number"
            value={transportCost}
            onChange={(e) => setTransportCost(Number.parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 p-2 md:p-3 w-full rounded-md bg-white dark:bg-gray-800"
          />

          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-4">
            Transport Cost: ₹{transportCost}/-
          </h3>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-3xl md:text-6xl font-bold text-center py-6 md:py-12 text-gray-900 dark:text-gray-100">
        Total Cost: ₹{totalCost.toFixed(2)}/-
      </h3>
      <h3 className="text-3xl md:text-6xl font-bold text-center py-6 md:py-12 text-gray-900 dark:text-gray-100">
        Final Cost: {finalCost}/-
      </h3>
    </div>
  )
}

