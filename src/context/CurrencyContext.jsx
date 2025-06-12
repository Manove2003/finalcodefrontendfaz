"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create Currency Context
const CurrencyContext = createContext()

// Currency Provider
export const CurrencyProvider = ({ children }) => {
  // Hardcoded exchange rates (base: USD, approximate as of May 2025)
  const exchangeRates = {
    USD: 1,
    EUR: 0.95,
    GBP: 0.82,
    JPY: 152.37,
    AUD: 1.53,
    CAD: 1.39,
    CHF: 0.89,
    CNY: 7.25,
    INR: 84.12,
    BRL: 5.67,
    MXN: 20.15,
    ZAR: 18.45,
    KRW: 1378.23,
    SGD: 1.36,
    NZD: 1.68,
    SEK: 10.85,
    NOK: 11.23,
    DKK: 7.09,
    AED: 3.67, // 1 USD = 3.67 AED
    HKD: 7.81,
  }

  // Initialize currency state from localStorage or default to "AED"
  const [currency, setCurrency] = useState(() => {
    // Check if window is defined to avoid SSR issues
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCurrency") || "AED"
    }
    return "AED"
  })

  // Update localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem("selectedCurrency", currency)
  }, [currency])

  // Convert price from AED to selected currency
  const convertPrice = (priceInAED) => {
    // Convert AED to USD first (priceInAED / AED rate)
    const priceInUSD = priceInAED / exchangeRates.AED
    // Convert USD to target currency
    const rate = exchangeRates[currency] || 1
    return Math.round(priceInUSD * rate) // Round to nearest whole number
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, exchangeRates }}>
      {children}
    </CurrencyContext.Provider>
  )
}

// Custom hook to use Currency Context
export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}