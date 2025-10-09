// src/services/financialService.ts
export async function getFinancialAnalysis(lat: number, lon: number, minBudget: number, maxBudget: number) {
    const response = await fetch("http://localhost:3000/api/financial/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat,
        lon,
        budgetRange: { min: minBudget, max: maxBudget },
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch financial data: ${response.statusText}`);
    }
  
    return response.json();
  }
  