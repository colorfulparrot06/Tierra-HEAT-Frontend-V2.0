// src/services/selectionService.ts
import { npv, irr, lcoe, simplePaybackYears, benefitCostRatio } from "./finance.js";
export function evaluateCandidateFromReopt(raw, discountRate = 0.07) {
    const outputs = raw.outputs ?? {};
    const financial = outputs?.financial ?? {};
    const analysisYears = (raw.inputs?.Financial?.analysis_years ?? raw.inputs?.financial?.analysis_years) ?? 20;
    // Extract PV & storage sizing if present
    const pvSize = outputs?.PV?.size_kw ?? outputs?.pv?.size_kw ?? outputs?.pv_kw ?? 0;
    const storageKw = outputs?.ElectricStorage?.size_kw ?? outputs?.storage?.size_kw ?? 0;
    const storageKwh = outputs?.ElectricStorage?.size_kwh ?? outputs?.storage?.size_kwh ?? 0;
    // Capital costs: try common fields
    const capex = outputs?.lifecycle_costs_us_dollars?.capital_costs
        ?? outputs?.lifecycle_costs?.capital_costs
        ?? outputs?.total_capital_cost_us_dollars
        ?? outputs?.capital_costs_us_dollars
        ?? (outputs?.pv?.capital_cost_us_dollars ?? 0) + (outputs?.storage?.capital_cost_us_dollars ?? 0)
        ?? 0;
    // Annual net savings: try a few fields
    const annualSavings = outputs?.electric_tariff?.annual_total_savings_us_dollars
        ?? outputs?.annual_operating_cost_savings_us_dollars
        ?? outputs?.annual_savings_us_dollars
        ?? outputs?.optimal_costs?.annual_operating_cost_us_dollars
        ?? outputs?.annual_benefits_us_dollars
        ?? 0;
    // annual energy produced by PV (year 1)
    const annualPV = outputs?.PV?.year_one_energy_produced_kwh ?? outputs?.pv?.year_one_energy_produced_kwh ?? outputs?.pv_year_one_energy_kwh ?? 0;
    // Build simple cashflow: t=0 capex (negative), t=1..N annualNetSavings (positive)
    const cashflows = [-capex];
    for (let t = 1; t <= analysisYears; t++)
        cashflows.push(annualSavings);
    const candidate = {
        id: raw.id,
        run_uuid: raw.run_uuid,
        pv_kw: pvSize,
        storage_kw: storageKw,
        storage_kwh: storageKwh,
        capex_usd: capex,
        annual_net_savings_usd: annualSavings,
        annual_energy_production_kwh: annualPV,
        lifecycle_years: analysisYears,
        discount_rate: discountRate,
        npv: npv(discountRate, cashflows),
        irr: irr(cashflows),
        payback_years: simplePaybackYears(capex, annualSavings),
        lcoe: annualPV ? lcoe(discountRate, [-capex, ...new Array(analysisYears).fill(0)], [0, ...new Array(analysisYears).fill(annualPV)]) : undefined,
        bcr: undefined,
        raw,
    };
    // compute BCR if outputs provide benefits and costs arrays (fall back to simple)
    try {
        const benefits = new Array(analysisYears + 1).fill(0);
        benefits[0] = 0;
        for (let i = 1; i <= analysisYears; i++)
            benefits[i] = annualSavings;
        const costs = new Array(analysisYears + 1).fill(0);
        costs[0] = capex;
        candidate.bcr = benefitCostRatio(discountRate, benefits, costs);
    }
    catch (e) {
        candidate.bcr = undefined;
    }
    return candidate;
}
