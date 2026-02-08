# SILENCE.OBJECTS — Portal Dashboard Spec v5.0

## Layout: F-pattern (desktop) / Z-pattern (mobile)

### Band A: Hero KPIs (full width)
- W1: hero_kpi_overview — ARR, MRR, DAU, Churn, LTV/CAC, Runway
- W2: hero_system_status — operational badges, commit, CI green
- W3: hero_safety_compliance — P0/P1/P2 badges with colors

### Band B: 3 columns (Product | Agents | Events)
- W4: product_analysis_volume — analyses/day, growth trend
- W5: product_module_activation — 15 modules table, O/C badges
- W6: product_archetype_distribution — 12 archetypes breakdown
- W7: agents_layer_status — 3 layer cards, active dots
- W8: agents_task_queue — pending/running/completed counts
- W9: agents_cost_efficiency — cost vs human equivalent
- W10: events_rate_overview — events/min, domain breakdown
- W11: events_recent_feed — last 10 events timeline
- W12: events_schema_health — schema validation status

### Band C: Compliance & Safety
- W13: compliance_forbidden_scan — vocabulary violations
- W14: compliance_p0_p1_p2_matrix — priority badges
- W15: safety_crisis_incidents — incident log

### Band D: Architecture & Modules
- W16: arch_module_dependency — dependency graph
- W17: arch_request_flow — request pipeline
- W18: arch_data_layer — Supabase tables overview

### Band E: Investor & Business
- W19: investor_revenue_projection — ARR chart
- W20: investor_paywall_funnel — conversion funnel
- W21: investor_market_positioning — TAM/SAM/SOM

### Band F: Ops & Deployment
- W22: ops_phase_progress — Phase 0-3 bars
- W23: ops_cicd_status — Sentinel checks, last deploy
- W24: ops_deployment_history — recent deploys timeline

## Design Rules
- SILENCE DARK: bg-[#08080a] body, bg-[#111113] cards, border-[#222228]
- JetBrains Mono for KPI values/labels, Outfit for body text
- Section headers: border-l-2 border-[#21808d] pl-3 font-mono uppercase
- Widget hover: hover:shadow-lg hover:shadow-[#21808d]/5 transition-all
- Grain overlay on body::before
- Global filters: 24h/7d/30d/All + prod/stage/local toggles
- ALL MOCK DATA — replace with Supabase queries later

## CHANGELOG (PORTAL_SPEC.md)
- 2026-02-08 — Initial spec, 24 widgets, F-pattern layout
