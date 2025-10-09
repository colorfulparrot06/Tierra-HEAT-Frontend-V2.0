// src/services/candidateRunner.ts
import { runReopt } from "./reoptService.js";
import { evaluateCandidateFromReopt } from "./selectionService.js";
export async function runCandidateGrid(opts) {
    const pvGrid = opts.pv_kw_grid && opts.pv_kw_grid.length > 0 ? opts.pv_kw_grid : [0, 50, 100, 200, 500];
    const storageGrid = opts.storage_kwh_grid && opts.storage_kwh_grid.length > 0 ? opts.storage_kwh_grid : [0, 50, 100, 200];
    const combinations = [];
    for (const pv of pvGrid) {
        for (const st of storageGrid)
            combinations.push({ pv, storage: st });
    }
    const results = [];
    const concurrency = Math.max(1, opts.concurrency ?? 2);
    let index = 0;
    const workers = [];
    const worker = async () => {
        while (true) {
            const i = index++;
            if (i >= combinations.length)
                return;
            const combo = combinations[i];
            try {
                const payload = await runReopt(opts.lat, opts.lon, {
                    loads_kw: opts.loads_kw,
                    doe_reference_name: opts.doe_reference_name,
                    annual_kwh: opts.annual_kwh,
                    urdb_label: opts.urdb_label,
                    analysis_years: opts.analysis_years,
                    timeoutMs: opts.timeoutMs ?? 180000,
                    max_kw: combo.pv > 0 ? combo.pv : undefined,
                    max_kwh: combo.storage > 0 ? combo.storage : undefined,
                    financial: opts.financial,
                });
                const raw = {
                    id: `pv${combo.pv}_st${combo.storage}`,
                    run_uuid: payload?.run_uuid,
                    inputs: payload?.inputs ?? payload?.input ?? {},
                    outputs: payload?.outputs ?? {},
                    messages: payload?.messages ?? {},
                };
                const evaluated = evaluateCandidateFromReopt(raw, opts.financial?.discount_rate_fraction ?? 0.07);
                results.push({ combo, raw, evaluated });
            }
            catch (err) {
                const errorMessage = err && typeof err === "object" && "message" in err
                    ? err.message
                    : String(err);
                results.push({ combo, error: errorMessage });
            }
        }
    };
    for (let w = 0; w < concurrency; w++)
        workers.push(worker());
    await Promise.all(workers);
    return results.map((r) => {
        if (r.error)
            return { id: `pv${r.combo.pv}_st${r.combo.storage}`, error: r.error };
        const eva = r.evaluated;
        return {
            id: r.raw.id,
            combo: r.combo,
            run_uuid: r.raw.run_uuid,
            pv_kw: eva.pv_kw,
            storage_kwh: eva.storage_kwh,
            capex_usd: eva.capex_usd,
            annual_net_savings_usd: eva.annual_net_savings_usd,
            npv: eva.npv,
            irr: eva.irr,
            payback_years: eva.payback_years,
            lcoe: eva.lcoe,
            bcr: eva.bcr,
            raw: r.raw,
        };
    });
}
//Monte Carlo evaluator:
export async function evaluateMonteCarlo(opts) {
    const samples = opts.samples ?? 500;
    const unc = opts.uncertainty ?? {};
    const results = [];
    const npvs = [];
    let nominalPayload;
    if (opts.candidate?.pv_kw != null || opts.candidate?.storage_kwh != null) {
        nominalPayload = await runReopt(opts.lat, opts.lon, {
            loads_kw: opts.loads_kw,
            doe_reference_name: opts.doe_reference_name,
            annual_kwh: opts.annual_kwh,
            urdb_label: opts.urdb_label,
            analysis_years: opts.analysis_years,
            max_kw: opts.candidate.pv_kw,
            max_kwh: opts.candidate.storage_kwh,
            financial: opts.financial,
            timeoutMs: opts.timeoutMs,
        });
    }
    else {
        nominalPayload = opts.candidate;
    }
    const raw = {
        id: `mc_nominal`,
        run_uuid: nominalPayload?.run_uuid,
        inputs: nominalPayload?.inputs ?? {},
        outputs: nominalPayload?.outputs ?? {},
    };
    const outputs = raw.outputs ?? {};
    const capexNom = outputs?.lifecycle_costs_us_dollars?.capital_costs ?? outputs?.capital_costs_us_dollars ?? 0;
    const annualSavingsNom = outputs?.annual_savings_us_dollars ?? outputs?.electric_tariff?.annual_total_savings_us_dollars ?? outputs?.annual_benefits_us_dollars ?? 0;
    const annualEnergyNom = outputs?.PV?.year_one_energy_produced_kwh ?? outputs?.pv?.year_one_energy_produced_kwh ?? 0;
    const analysisYears = raw.inputs?.Financial?.analysis_years ?? opts.analysis_years ?? 20;
    const discountRate = raw.inputs?.Financial?.discount_rate_fraction ?? opts.financial?.discount_rate_fraction ?? 0.07;
    function sampleNormal(mean = 0, std = 1) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + z0 * std;
    }
    for (let i = 0; i < samples; i++) {
        const capexFactor = 1 + (unc.capex_pct_std ? sampleNormal(0, unc.capex_pct_std) : 0);
        const energyFactor = 1 + (unc.energy_prod_pct_std ? sampleNormal(0, unc.energy_prod_pct_std) : 0);
        const escalationFactor = (opts.financial?.elec_cost_escalation_rate_fraction ?? 0.03) + (unc.elec_escalation_pct_std ? sampleNormal(0, unc.elec_escalation_pct_std) : 0);
        const capexSample = capexNom * capexFactor;
        const annualSavingsSample = annualSavingsNom * energyFactor;
        const cashflows = [-capexSample];
        for (let t = 1; t <= analysisYears; t++) {
            const escalated = annualSavingsSample * Math.pow(1 + escalationFactor, t - 1);
            cashflows.push(escalated);
        }
        const pv = cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + discountRate, t), 0);
        npvs.push(pv);
    }
    const mean = npvs.reduce((a, b) => a + b, 0) / npvs.length;
    const sorted = [...npvs].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const probPositive = npvs.filter((n) => n > 0).length / npvs.length;
    return {
        nominal: {
            capex: capexNom,
            annualSavings: annualSavingsNom,
            annualEnergy: annualEnergyNom,
            analysisYears,
            discountRate,
            raw,
        },
        mc: {
            samples,
            mean,
            median,
            p10,
            p90,
            probPositive,
            npvs,
        },
    };
}
