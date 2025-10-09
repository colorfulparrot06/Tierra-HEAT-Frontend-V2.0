import { v4 as uuidv4 } from "uuid";

interface Candidate {
  id: string;
  pv_kw: number;
  storage_kwh: number;
  capex_usd: number;
  annual_net_savings_usd: number;
  npv: number;
  irr: number;
  payback_years: number;
  lcoe: number;
  bcr: number;
  raw: any; 
}

interface MonteCarloResult {
  id: string;
  pv_kw: number;
  storage_kwh: number;
  npv_mean: number;
  npv_std: number;
  payback_mean: number;
  payback_std: number;
}


export async function runCandidateGrid(
  reoptResult: any,
  budgetRange: { min: number; max: number }
): Promise<Candidate[]> {
  if (!reoptResult || !reoptResult.PV || !reoptResult.ElectricStorage) {
    throw new Error("Invalid REopt result for candidate grid generation");
  }

  const results: Candidate[] = [];

  const pvOptions = [0, 5, 10, 20]; // kW
  const storageOptions = [0, 10, 20, 40]; // kWh

  for (const pv of pvOptions) {
    for (const storage of storageOptions) {
      const pvCost = pv * (reoptResult.PV.capital_cost_per_kw ?? 3000);
      const storageCost =
        storage * ((reoptResult.ElectricStorage?.capital_cost_per_kwh ?? 500));
      const capex = pvCost + storageCost;

      if (capex >= budgetRange.min && capex <= budgetRange.max) {
        const annualNetSavings =
          (reoptResult.Financial?.elec_savings_annual ?? 0) * (pv / 5);
        const npv = annualNetSavings * 20 - capex; // simple NPV over 20 years
        const irr = npv / capex; // rough IRR estimate
        const paybackYears = capex / (annualNetSavings || 1);
        const lcoe = capex / (annualNetSavings || 1); // simplified LCOE
        const bcr = annualNetSavings / (capex / 20);

        results.push({
          id: uuidv4(),
          pv_kw: pv,
          storage_kwh: storage,
          capex_usd: capex,
          annual_net_savings_usd: annualNetSavings,
          npv,
          irr,
          payback_years: paybackYears,
          lcoe,
          bcr,
          raw: { pv, storage, reoptResult },
        });
      }
    }
  }

  return results;
}

export async function runMonteCarlo(candidates: Candidate[]): Promise<MonteCarloResult[]> {
  const monteCarloResults: MonteCarloResult[] = [];
  console.log("Fetching Monte Carlo data...");
  for (const c of candidates) {
    const simulations = 1000;
    const npvSamples: number[] = [];
    const paybackSamples: number[] = [];

    for (let i = 0; i < simulations; i++) {
      const npvVariation = c.npv * (1 + (Math.random() - 0.5) * 0.2);
      const paybackVariation = c.payback_years * (1 + (Math.random() - 0.5) * 0.2);

      npvSamples.push(npvVariation);
      paybackSamples.push(paybackVariation);
    }

    const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = (arr: number[]) => {
      const m = mean(arr);
      return Math.sqrt(arr.reduce((sum, val) => sum + (val - m) ** 2, 0) / arr.length);
    };
    console.log("Monte Carlo OK");
    monteCarloResults.push({
      id: c.id,
      pv_kw: c.pv_kw,
      storage_kwh: c.storage_kwh,
      npv_mean: mean(npvSamples),
      npv_std: std(npvSamples),
      payback_mean: mean(paybackSamples),
      payback_std: std(paybackSamples),
    });
  }

  return monteCarloResults;
}
