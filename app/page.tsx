"use client";

import { useState, useEffect } from "react";

type MachinePricing = {
  basePrice: number;
  extraPricePerThousand: number;
};

type PricingData = {
  pricingData: {
    [machine: string]: {
      [printType: string]: MachinePricing;
    };
  };
};


export default function Home() {
  const [machines, setMachines] = useState<PricingData>({ pricingData: {} });
  const [selectedMachine, setSelectedMachine] = useState("M1");
  const [selectedPrintType, setSelectedPrintType] = useState("");
  const [quantity, setQuantity] = useState(1000);
  const [wastage, setWastage] = useState(200);
  const [price, setPrice] = useState(0);

  // ✅ Board Pricing Data
  const boardPrices = {
    artPaper: {
      sizes: {
        "20x30": { "80GSM": 2.72, "90GSM": 2.98, "100GSM": 3.30, "130GSM": 4.15, "170GSM": 5.43, "220GSM": 7.03, "250GSM": 7.99, "300GSM": 9.58, "350GSM": 11.35 },
        "23x36": { "80GSM": 3.73, "90GSM": 4.10, "100GSM": 4.57, "130GSM": 5.73, "170GSM": 7.49, "220GSM": 9.70, "250GSM": 11.00, "300GSM": 13.22, "350GSM": 15.65 },
        "25x36": { "80GSM": 4.06, "90GSM": 4.46, "100GSM": 4.96, "130GSM": 6.22, "170GSM": 8.14, "220GSM": 10.54, "250GSM": 11.98, "300GSM": 14.37, "350GSM": 17.02 }
      }
    },
    maplithio: {
      sizes: {
        "20x30": { "60GSM": 1.90, "70GSM": 2.18, "80GSM": 2.48, "90GSM": 2.79, "100GSM": 3.10, "120GSM": 3.72 },
        "23x36": { "60GSM": 2.63, "70GSM": 2.97, "80GSM": 3.42, "90GSM": 3.85, "100GSM": 4.37, "120GSM": 5.11 },
        "25x36": { "60GSM": 3.25, "70GSM": 3.72, "80GSM": 4.18, "90GSM": 4.65, "100GSM": 5.57 },
        "17x27": { "60GSM": 1.66, "70GSM": 1.90, "80GSM": 2.13, "90GSM": 2.37, "100GSM": 2.84 }
      }
    },
    cyberXL: {
      sizes: {
        "31.5x41.5": { "350GSM": 25.68, "300GSM": 22.01 },
        "25x41.5": { "350GSM": 20.38, "300GSM": 17.47 },
        "25x36": { "350GSM": 17.68, "300GSM": 15.15 },
        "23x36": { "350GSM": 16.27, "300GSM": 13.94 }
      }
    },
    whiteBack: {
      sizes: {
        "31.5x41.5": { "350GSM": 18.89, "300GSM": 16.19 },
        "25x41.5": { "350GSM": 15.00, "300GSM": 12.85 },
        "25x36": { "350GSM": 13.00, "300GSM": 11.15 },
        "23x36": { "350GSM": 11.97, "300GSM": 10.26 }
      }
    },
    grayBack: {
      sizes: {
        "31.5x41.5": { "230GSM": 11.05, "250GSM": 12.02, "300GSM": 13.66 },
        "25x41.5": { "230GSM": 8.78, "250GSM": 9.54, "300GSM": 10.84 },
        "25x36": { "230GSM": 7.61, "250GSM": 8.28, "300GSM": 9.40 },
        "23x36": { "230GSM": 7.02, "250GSM": 7.62, "300GSM": 8.65 }
      }
    },
    stickerPaper: {
      sizes: {
        "20x30": { "StayOn": 12.00, "StickOn": 11.50 },
        "18x25": { "StayOn": 8.50, "StickOn": 9.50 },
        "18x23": { "StayOn": 8.15, "StickOn": 9.00 },
        "23x36": { "StayOn": 17.50, "StickOn": 11.00 }
      }
    }
  };
  

// Board Cost Calculation
const [selectedSize, setSelectedSize] = useState("23 X 36"); // Default to 23 X 36
const [selectedGSM, setSelectedGSM] = useState("350");
const [boardCost, setBoardCost] = useState(0);
const [division, setDivision] = useState(1);
const [selectedBoard, setSelectedBoard] = useState<keyof typeof boardPrices>("artPaper");



  // Coating Calculation
  const [coatingType, setCoatingType] = useState("Gloss");
  const [coatingHeight, setCoatingHeight] = useState(0);
  const [coatingWidth, setCoatingWidth] = useState(0);
  const [coatingPrice, setCoatingPrice] = useState(0);

  // Die Cost
  const [dieCost, setDieCost] = useState(500);

 // Punching Cost
 const [punchingType, setPunchingType] = useState("Paper Board");
 const [punchingCostPerThousand, setPunchingCostPerThousand] = useState(500);
 const [punchingCost, setPunchingCost] = useState(0);

 // Cutting Cost
 const [cuttingType, setCuttingType] = useState("Metpet");
 const [cuttingCost, setCuttingCost] = useState(0);

 // Transport Cost
 const [transportCost, setTransportCost] = useState(2000);

 // Pasting Cost
 const [pastingType, setPastingType] = useState("Bottom Lock");
 const [ups, setUps] = useState(1);
 const [pastingCost, setPastingCost] = useState(0);
 const API_URL = process.env.NEXT_PUBLIC_API_URL;
 useEffect(() => {
  fetch(`https://quotation-backend-beta.vercel.app/api/get-pricing`)
    .then((res) => res.json())
    .then((data: PricingData) => {
      setMachines(data);
      if (data.pricingData[selectedMachine]) {
        setSelectedPrintType(Object.keys(data.pricingData[selectedMachine])[0] || "");
      }
    });
}, []);

useEffect(() => {
  if (machines.pricingData[selectedMachine] && machines.pricingData[selectedMachine][selectedPrintType]) {
    const { basePrice, extraPricePerThousand } = machines.pricingData[selectedMachine][selectedPrintType];

    let finalPrice;
    if (quantity <= 3000) {
      finalPrice = basePrice;
    } else {
      const extraUnits = Math.ceil((quantity - 3000) / 1000);
      finalPrice = basePrice + extraUnits * extraPricePerThousand;
    }

    setPrice(finalPrice);
  }
}, [selectedMachine, selectedPrintType, quantity, machines]);

useEffect(() => {
  if (!boardPrices || !selectedBoard || !selectedSize || !selectedGSM) return;

  // Ensure selectedBoard is a valid key
  if (!(selectedBoard in boardPrices)) return;

  const board = boardPrices[selectedBoard as keyof typeof boardPrices];

  // Ensure selectedSize is a valid key
  if (!(selectedSize in board.sizes)) return;

  const sizeData = board.sizes[selectedSize as keyof typeof board.sizes];

  // Ensure selectedGSM is a valid key
  if (!(selectedGSM in sizeData)) return;

  const boardPricePerSheet = sizeData[selectedGSM as keyof typeof sizeData] ?? 0;

  if (boardPricePerSheet) {
    const costPerDivision = boardPricePerSheet / division;
    const totalBoardCost = costPerDivision * (quantity + wastage);
    setBoardCost(totalBoardCost);
  }
}, [selectedBoard, selectedSize, selectedGSM, quantity, division, wastage, boardPrices]);




useEffect(() => {
  setPunchingCost((quantity / 1000) * punchingCostPerThousand);
}, [quantity, punchingCostPerThousand]);

useEffect(() => {
const rate = punchingType === "Paper Board" ? 500 : 1000;
    setPunchingCost((quantity / 1000) * rate);
  }, [quantity, punchingType]);

  useEffect(() => {
    let cost = 0;
    if (cuttingType === "Metpet") {
      cost = quantity <= 3000 ? 3000 : (3000 / quantity) * 3000;
    } else if (cuttingType === "4 Color") {
      cost = quantity <= 2000 ? 2000 : (2000 / quantity) * 2000;
    }
    setCuttingCost(cost);
  }, [quantity, cuttingType]);

useEffect(() => {
  setPunchingCostPerThousand(punchingType === "Paper Board" ? 500 : 1000);
}, [punchingType]);


  useEffect(() => {
    fetch("https://quotation-backend-beta.vercel.app/api/get-pricing")
      .then((res) => res.json())
      .then((data: PricingData) => {
        setMachines(data);
        if (data.pricingData[selectedMachine]) {
          setSelectedPrintType(Object.keys(data.pricingData[selectedMachine])[0] || "");
        }
      });
  }, []);

  useEffect(() => {
    if (machines.pricingData[selectedMachine] && machines.pricingData[selectedMachine][selectedPrintType]) {
      const { basePrice, extraPricePerThousand } = machines.pricingData[selectedMachine][selectedPrintType];

      let finalPrice;
      if (quantity <= 3000) {
        finalPrice = basePrice;
      } else {
        const extraUnits = Math.ceil((quantity - 3000) / 1000);
        finalPrice = basePrice + extraUnits * extraPricePerThousand;
      }

      setPrice(finalPrice);
    }
  }, [selectedMachine, selectedPrintType, quantity, machines]);

  const calculateCoatingCost = () => {
    let rate = 0;
    if (coatingType === "Gloss") rate = 0.38;
    else if (coatingType === "Matt") rate = 0.45;
    else if (coatingType === "Texture UV") rate = 0.80;
    else if (coatingType === "Metpet") rate = 1.45;

    const totalQuantity = quantity + wastage;
    const cost = ((coatingHeight * coatingWidth * rate) / 100) * totalQuantity;

    setCoatingPrice(cost);
  };
  useEffect(() => {
    let rate = pastingType === "Bottom Lock" ? 0.45 : 0.25;
    setPastingCost(ups * quantity * rate);
  }, [ups, quantity, pastingType]);

  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    setTotalCost(
      boardCost +
      price +
      coatingPrice +
      dieCost +
      punchingCost +
      pastingCost +
      transportCost
    );
  }, [boardCost, price, coatingPrice, dieCost, punchingCost, pastingCost, transportCost]);
  
  const finalCost = ((totalCost * 1.15) / (quantity * ups)).toFixed(2);

  
  return (
    <div className="p-6 bg-white text-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Offset Quotation Maker</h1>


   {/* Board Type Selection */}
   <label className="block text-gray-700">Board Type:</label>
    <select
      value={selectedBoard}
      onChange={(e) => setSelectedBoard(e.target.value as keyof typeof boardPrices)}
      className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
    >
      {Object.keys(boardPrices).map((board) => (
        <option key={board} value={board}>{board}</option>
      ))}
    </select>

    {/* Board Size Selection */}
    <label className="block text-gray-700">Board Size:</label>
    <select
      value={selectedSize}
      onChange={(e) => setSelectedSize(e.target.value)}
      className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      disabled={!selectedBoard}
    >
      <option value="">Select Size</option>
      {selectedBoard &&
        Object.keys(boardPrices[selectedBoard].sizes).map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
    </select>

    {/* GSM Selection */}
{/* GSM Selection */}
{selectedSize && selectedBoard && (
  <>
    <label className="block text-gray-700">GSM:</label>
    <select
      value={selectedGSM}
      onChange={(e) => setSelectedGSM(e.target.value)}
      className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      disabled={!selectedSize}
    >
      <option value="">Select GSM</option>
      {Object.keys(
        boardPrices[selectedBoard as keyof typeof boardPrices]?.sizes?.[
          selectedSize as keyof typeof boardPrices[typeof selectedBoard]["sizes"]
        ] || {}
      ).map((gsm) => (
        <option key={gsm} value={gsm}>{gsm}</option>
      ))}
    </select>
  </>
)}

      <label className="block text-gray-700">Division:</label>
      <input
        type="number"
        value={division}
        onChange={(e) => setDivision(parseInt(e.target.value) || 1)}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      />


            <label className="block text-gray-700">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
            />

<h3 className="text-lg font-bold text-gray-900">
  Board Cost: ₹{boardCost ? boardCost.toFixed(2) : "0.00"}/-
</h3>
      <hr className="my-6" />
            

      {/* Machine Selection */}
      <h2 className="text-xl font-bold text-gray-900">Printing Cost Calculation</h2>
      <label className="block text-gray-700">Machine:</label>
      <select
        onChange={(e) => setSelectedMachine(e.target.value)}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      >
        {Object.keys(machines.pricingData).map((machine) => (
          <option key={machine} value={machine}>
            {machine}
          </option>
        ))}
      </select>

      {/* Printing Type Selection */}
      {machines.pricingData[selectedMachine] && (
        <div>
          <label className="block text-gray-700">Printing Type:</label>
          <select
            onChange={(e) => setSelectedPrintType(e.target.value)}
            className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
          >
            {Object.keys(machines.pricingData[selectedMachine]).map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity Input */}
      <label className="block text-gray-700">Quantity:</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      />

      {/* Wastage Input */}
      <label className="block text-gray-700">Wastage (Default: 200):</label>
      <input
        type="number"
        value={wastage}
        onChange={(e) => setWastage(parseInt(e.target.value))}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      />

      <h2 className="text-xl font-bold text-gray-900">Estimated Print Price: {price}/-</h2>

      <hr className="my-6" />

      {/* Coating Section */}
      <h2 className="text-xl font-bold text-gray-900">Coating & Lamination</h2>
      <label className="block text-gray-700">Type:</label>
      <select
        onChange={(e) => setCoatingType(e.target.value)}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      >
        <option value="Gloss">Gloss (Lamination)</option>
        <option value="Matt">Matt (Lamination)</option>
        <option value="Texture UV">Texture UV</option>
        <option value="Metpet">Metpet</option>
      </select>

      <label className="block text-gray-700">Height (cm):</label>
      <input
        type="number"
        onChange={(e) => setCoatingHeight(Number(e.target.value))}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      />

      <label className="block text-gray-700">Width (cm):</label>
      <input
        type="number"
        onChange={(e) => setCoatingWidth(Number(e.target.value))}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      />

      <button
        onClick={calculateCoatingCost}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Calculate Coating Cost
      </button>

      <h3 className="text-lg font-bold text-gray-900">
        Coating Cost: {coatingPrice.toFixed(2)}/-
      </h3>

      <hr className="my-6" />

      {/* Die Cost Section */}
      <h2 className="text-xl font-bold text-gray-900">Die Cost</h2>
      <label className="block text-gray-700">Die Cost (Default: 500):</label>
      <input
        type="number"
        value={dieCost}
        onChange={(e) => setDieCost(parseInt(e.target.value))}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      />
      
      <hr className="my-6" />

       {/* Punching Section */}
       <h2 className="text-xl font-bold text-gray-900">Punching</h2>
      <label className="block text-gray-700">Select Punching Type:</label>
      <select
        value={punchingType}
        onChange={(e) => setPunchingType(e.target.value)}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      >
        <option value="Paper Board">Paper Board (₹500 per 1000)</option>
        <option value="E-Flute">E-Flute (₹1000 per 1000)</option>
      </select>
      <h3 className="text-lg font-bold text-gray-900">Punching Cost: {punchingCost.toFixed(2)}/-</h3>
      
      <hr className="my-6" />

      {/* Cutting Section */}
      <h2 className="text-xl font-bold text-gray-900">Cutting</h2>
      <label className="block text-gray-700">Cutting Type:</label>
      <select
        value={cuttingType}
        onChange={(e) => setCuttingType(e.target.value)}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      >
        <option value="Metpet">Metpet - ₹3000 (up to 3000 sheets)</option>
        <option value="4 Color">4 Color - ₹2000 (up to 2000 sheets)</option>
      </select>
      <h3 className="text-lg font-bold text-gray-900">Cutting Cost: {cuttingCost.toFixed(2)}/-</h3>
      
      <hr className="my-6" />

      
{/* Pasting Section */}
<h2 className="text-xl font-bold text-gray-900">Pasting</h2>

<label className="block text-gray-700">Pasting Type:</label>
<select
  value={pastingType}
  onChange={(e) => setPastingType(e.target.value)}
  className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
>
  <option value="Bottom Lock">Bottom Lock</option>
  <option value="Side Pasting">Side Pasting</option>
</select>

<label className="block text-gray-700">Number of Ups:</label>
<input
  type="number"
  value={ups}
  onChange={(e) => setUps(parseInt(e.target.value))}
  className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
/>

<h3 className="text-lg font-bold text-gray-900">Pasting Cost: {pastingCost.toFixed(2)}/-</h3>

<hr className="my-6" />

{/* Transport Section */}
<h2 className="text-xl font-bold text-gray-900">Transport</h2>
      <input
        type="number"
        value={transportCost}
        onChange={(e) => setTransportCost(parseInt(e.target.value))}
        className="border border-gray-300 p-2 mb-4 rounded-md bg-white"
      />
      <h3 className="text-lg font-bold text-gray-900">Transport Cost: {transportCost}/-</h3>
      
      <hr className="my-6" />

      {/* Total Cost */}
      

     
      <h3 className="text-xl font-bold text-gray-900">
      <h3 className="text-lg font-bold text-gray-900">
  Total Cost: ₹{totalCost.toFixed(2)}/-
</h3>
{/* Display Final Cost */}
<h3 className="text-xl font-bold text-gray-900">
      Final Cost: {finalCost}/-
    </h3>


      </h3>
    </div>
  );
}

