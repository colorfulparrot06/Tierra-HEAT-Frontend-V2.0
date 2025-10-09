// src/services/reoptService.ts
import apiClient from "../utils/apiClient.js";
const REOPT_BASE = "https://developer.nrel.gov/api/reopt/stable";
/**
 * Submits a scenario to the REopt API and polls until completion or timeout.
 * Returns the raw payload from REopt (inputs, outputs, messages, status...).
 */
export async function runReopt(lat, lon, opts = {}) {
    const apiKey = process.env.NREL_API_KEY;
    if (!apiKey)
        throw new Error("Missing NREL_API_KEY");
    const scenario = {
        Site: { latitude: lat, longitude: lon },
        ElectricLoad: {},
        ElectricTariff: {},
        PV: {},
        ElectricStorage: {},
        Financial: {
            analysis_years: opts.analysis_years ?? 20,
            discount_rate_fraction: 0.07,
            inflation_rate_fraction: 0.02,
            elec_cost_escalation_rate_fraction: 0.03,
            om_cost_escalation_rate_fraction: 0.025,
            value_of_lost_load_us_dollars_per_kwh: 3,
        },
        // allow REopt to size systems unless limited by max_kw/max_kwh
    };
    if (opts.financial)
        Object.assign(scenario.Financial, opts.financial);
    // load
    if (opts.loads_kw && opts.loads_kw.length > 0) {
        scenario.ElectricLoad.loads_kw = opts.loads_kw;
    }
    else if (opts.doe_reference_name) {
        scenario.ElectricLoad.doe_reference_name = opts.doe_reference_name;
        if (opts.annual_kwh)
            scenario.ElectricLoad.annual_kwh = opts.annual_kwh;
    }
    else {
        throw new Error("Must supply loads_kw or doe_reference_name + annual_kwh for production-grade runs.");
    }
    // tariff
    scenario.ElectricTariff.urdb_label = opts.urdb_label ?? process.env.URDB_LABEL ?? undefined;
    if (!scenario.ElectricTariff.urdb_label) {
        // For some REopt runs a missing tariff is allowed (islanded/off-grid). For grid runs we recommend URDB.
        // Not throwing, but warn.
        console.warn("No URDB label provided; results may use default tariff assumptions.");
    }
    // PV & storage caps for candidate runs
    if (typeof opts.max_kw === "number")
        scenario.PV.max_kw = opts.max_kw;
    if (typeof opts.max_kwh === "number")
        scenario.ElectricStorage.max_kwh = opts.max_kwh;
    if (typeof opts.pv_existing_kw === "number")
        scenario.PV.existing_kw = opts.pv_existing_kw;
    // POST job
    const postUrl = `${REOPT_BASE}/job`;
    let postResp;
    try {
        postResp = await apiClient.post(postUrl, scenario, {
            headers: { "X-Api-Key": apiKey },
            timeout: 20000,
        });
    }
    catch (err) {
        const msg = err?.response?.data ?? err?.message ?? String(err);
        throw new Error(`REopt job POST failed: ${msg}`);
    }
    const run_uuid = postResp?.data?.run_uuid;
    if (!run_uuid)
        throw new Error("REopt API did not return run_uuid");
    // Poll results endpoint
    const resultsUrl = `${REOPT_BASE}/job/${run_uuid}/results`;
    const timeoutMs = opts.timeoutMs ?? 180000;
    const pollInterval = 4000;
    const start = Date.now();
    while (true) {
        try {
            const r = await apiClient.get(resultsUrl, {
                headers: { "X-Api-Key": apiKey },
                timeout: 20000,
            });
            const payload = r.data;
            const status = (payload?.status ?? "").toString().toLowerCase();
            // status often contains "Optimizing..." while running
            if (status && !status.includes("optimizing") && !status.includes("running")) {
                return payload;
            }
            if (Date.now() - start > timeoutMs) {
                return { run_uuid, status: "timeout", partial: payload };
            }
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }
        catch (err) {
            if (Date.now() - start > timeoutMs) {
                throw new Error(`Error polling REopt: ${err?.message ?? err} (timed out)`);
            }
            // wait and retry
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }
    }
}
