export function npv(discountRate: number, cashflows: number[]): number {
    return cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + discountRate, t), 0);
  }
  
  export function cumulativeCashflows(cashflows: number[]): number[] {
    const out: number[] = [];
    let s = 0;
    for (const cf of cashflows) {
      s += cf;
      out.push(s);
    }
    return out;
  }
  
  // Simple payback (years) using constant annual net savings
  export function simplePaybackYears(capex: number, annualNetSavings: number): number {
    if (annualNetSavings <= 0) return Number.POSITIVE_INFINITY;
    return capex / annualNetSavings;
  }
  
  // IRR via bisection method
  export function irr(cashflows: number[], maxIter = 60): number {
    const f = (r: number) => cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + r, t), 0);
    let low = -0.9999;
    let high = 1.0;
    let mid = 0.1;
    for (let i = 0; i < maxIter; i++) {
      mid = (low + high) / 2;
      const val = f(mid);
      const valLow = f(low);
      if (Math.abs(val) < 1e-6) return mid;
      if (valLow * val <= 0) high = mid;
      else low = mid;
    }
    return mid;
  }
  
  /**
   * LCOE:
   * costs: yearly costs array (t=0..N) — typically capex at t=0 + o&m per year
   * energy: yearly energy produced array (t=0..N) in kWh (if t=0 energy = 0)
   */
  export function lcoe(discountRate: number, costs: number[], energy: number[]): number {
    const pvCosts = costs.reduce((acc, c, t) => acc + c / Math.pow(1 + discountRate, t), 0);
    const pvEnergy = energy.reduce((acc, e, t) => acc + e / Math.pow(1 + discountRate, t), 0);
    if (pvEnergy === 0) return Number.POSITIVE_INFINITY;
    return pvCosts / pvEnergy;
  }
  
  /**
   * LCOS for storage (approx):
   * numerator: discounted costs (capex + replacements + cyclical O&M)
   * denominator: discounted delivered energy from storage (kWh)
   */
  export function lcos(discountRate: number, costs: number[], energyDelivered: number[]): number {
    return lcoe(discountRate, costs, energyDelivered);
  }
  
  /**
   * Benefit-Cost Ratio = PV(benefits) / PV(costs)
   * benefits: yearly benefits (savings)
   * costs: yearly costs
   */
  export function benefitCostRatio(discountRate: number, benefits: number[], costs: number[]): number {
    const pvBenefits = benefits.reduce((acc, b, t) => acc + b / Math.pow(1 + discountRate, t), 0);
    const pvCosts = costs.reduce((acc, c, t) => acc + c / Math.pow(1 + discountRate, t), 0);
    if (pvCosts === 0) return Number.POSITIVE_INFINITY;
    return pvBenefits / pvCosts;
  }
  