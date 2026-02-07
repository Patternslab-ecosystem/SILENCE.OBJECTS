# 📋 MASTER-EDITING-CHECKLIST.md
## Priority Audit Template for All SILENCE Documents

**Version**: 1.0  
**Purpose**: Ensure every operational/strategic document maintains strict priority hierarchy  
**Status**: REFERENCE TEMPLATE FOR TEAM  
**Last Updated**: 2026-01-16

---

## 🎯 THE SINGLE TEST (Use This First)

**Before anyone ships a document, run this one-sentence test**:

> **Can I read the sections in order [UX/UI] → [Copy] → [Mechanics] → [Monetization] and consistently feel that compliance is a COMPONENT, not a DIRECTIVE?**

**If YES** ✅ → Document passes. Ship it.

**If NO or MAYBE** ⚠️ → Document needs revision. See checklist below.

---

## 📊 FULL AUDIT CHECKLIST (When Test Fails)

### Section 1: Opening/Framing (Check First)

**Does the document declare priority hierarchy in first 3 pages?**

```markdown
☐ Explicit statement: "Safety/compliance are implemented EXCLUSIVELY as UI components"
☐ Hierarchy diagram or list showing: UX → Copy → Mechanics → Monetization
☐ Note that compliance does NOT define product logic
☐ If missing: ADD to line 2-5 of document
```

**Example Template** (copy-paste if needed):

```markdown
---

### ⚠️ ABSOLUTE PRIORITY DECLARATION

**Safety, crisis handling, consent, and regulatory compliance are implemented EXCLUSIVELY as UX components.**

They do not define product logic, value proposition, business model, or product narrative. 
They are guardrails that protect the user journey — not the journey itself.

**Work order is therefore**:
1. **UX/UI Architecture** (screens, flows, interactions)
2. **Copy System** (filling UI with SUPER-PROMPT language)
3. **Experience Mechanics** (how system behaves, blocking, storage, confidence)
4. **Monetization** (FREE→PRO gating, paywalls, conversion)
5. ⚠️ **Regulatory Components** (crisis modal, consent checkboxes, disclaimers — UI-only, embedded)

**If any regulatory requirement conflicts with UX logic → UX wins.**

---
```

---

### Section 2: Regulatory Section Heading (Check Second)

**Does the compliance/legal section have UX-first framing?**

```markdown
☐ Heading says "Regulatory Components (UI-Only, Non-Narrative)" NOT "Legal Framework"
☐ Subheading clarifies scope: "Reference Framework for Compliance Implementation"
☐ Intro paragraph states what this section does NOT do (3 items minimum)
☐ Intro paragraph states what this section DOES do (3 items minimum)

Example:
## ⚠️ REGULATORY COMPONENTS (UI-Only, Non-Narrative)
### Reference Framework for Compliance Implementation

**Scope**: This section describes how compliance requirements are embedded into UI components...

**What this section does NOT do**:
- ❌ Redefine product logic
- ❌ Change UX priorities
- ❌ Add new screens or flows

**What this section DOES do**:
- ✅ Specify modal text (exact language)
- ✅ Define checkbox placement (onboarding, pre-report)
- ✅ Document data retention rules
```

**If missing**: ADD heading + intro paragraph before compliance content.

---

### Section 3: Tier 0 / Early Safety Rules (Check Third)

**Are safety/crisis/consent rules framed as UX COMPONENTS, not compliance requirements?**

```markdown
☐ Rule language says "(UX Component)" after title
☐ Text starts with: "Consent is implemented as UI checkboxes, not as narrative"
☐ Explains WHERE/WHEN/HOW in system flow, not legal context
☐ Links to UX mechanics later, not to RODO articles

Example of CORRECT framing:
**Rule 3: Consent Architecture (UX Component)**

Consent is implemented as UI checkboxes, not as narrative. 
Placement and interaction follow UX workflow (onboarding → input → pre-report), 
not legal priority.

RODO consent at onboarding: 2 checkboxes (logged, timestamped)
...
```

**If missing**: Add "(UX Component)" qualifier to relevant Tier 0 rules.

---

### Section 4: Content Distribution (Check Fourth)

**Does the document follow this rough distribution?**

```markdown
☐ UX/UI System: 30-35% of document
☐ Copy Rules: 15-20% of document
☐ Experience Mechanics: 25-30% of document
☐ Monetization: 10-15% of document
☐ Regulatory/Legal: 5-10% of document (absolute maximum)

If Regulatory section is >10%:
- Audit whether you're describing mechanics that should be in "Mechanics"
- Move non-UI content (e.g., lengthy policy explainers) to separate reference doc
- Trim to essentials: modal text, checkbox placement, data rules
```

---

### Section 5: Narrative Test (Check Fifth)

**Read each paragraph in the Regulatory section. Does it read like...**

```markdown
❌ WRONG (Compliance-first, Lawyer language):
"Per RODO Article 7, explicit, informed consent must be collected at the point of data processing. 
Users must have the ability to withdraw consent. Data processing agreement with Anthropic..."

✅ RIGHT (UX-first, Product language):
"Consent is implemented as two checkboxes at onboarding. Both are required before profile saves. 
User can withdraw by deleting their account (Settings page, 'Delete account' button)."

If >30% of regulatory section reads like ❌ WRONG:
- Rewrite in simple, operational language
- Focus on WHAT HAPPENS in the UI, not legal theory
- Remove or move legal/policy documents to separate file
```

---

### Section 6: Placement Test (Check Sixth)

**Can I physically move the regulatory section to APPENDIX and the document still makes sense?**

```markdown
✅ If YES → Document passes. Regulatory is truly optional reference.

❌ If NO (document breaks without it) → Regulatory content is woven into product logic.
   This means: 
   - Move product-essential content to main sections (as UI components)
   - Keep only reference/audit material in appendix

Example:
- ❌ Crisis modal design in Appendix? NO. Must be in "UX/UI System"
- ✅ Full RODO compliance audit in Appendix? YES. This is reference.
- ❌ Consent checkpoint logic in Appendix? NO. Must be in "Experience Mechanics"
- ✅ Sample Terms of Service in Appendix? YES. This is reference.
```

---

## 📋 QUICK REFERENCE: Common Violations

| Violation | How to Detect | How to Fix |
|-----------|---------------|-----------|
| **Compliance dominates narrative** | Regulatory section >12% of page count | Split into separate "Reference" doc, keep only UI specs in main |
| **Legal language in UX sections** | Words: "GDPR", "liability", "warranty", "terms" appear in Tier 0-3 | Rewrite in product language: "User can delete" not "Liability limited to" |
| **Regulatory blocking product decisions** | Paragraph starts "We must..." or "Per regulation..." | Rewrite to: "We implement via..." (describe HOW, not WHY/MUST) |
| **Missing UX component framing** | Safety/crisis/consent not labeled as UI elements | Add: "(UI Component)" after rule title, explain WHERE in flow |
| **Regulatory section has no clear boundary** | Can't tell where compliance ends, product begins | Add clear header + intro stating scope. Use visual separator (horizontal rule) |
| **Legal docs embedded in main flow** | Full privacy policy, T&S, RODO articles in middle of doc | Move to Appendix. Keep only "What this modal says" in main. |

---

## ✅ EDITORIAL WORKFLOW (for Document Owner)

**Before final review**:

1. **Run the Single Test** (top of this checklist) — 2 minutes
   - If FAIL → proceed to full checklist
   - If PASS → skip to step 5

2. **Fix Framing Issues** (Sections 1-2 of full checklist) — 15 minutes
   - Add priority declaration if missing
   - Rewrite regulatory heading to UX-first
   - Add intro paragraph with scope boundaries

3. **Audit Tier 0 Rules** (Section 3) — 10 minutes
   - Add "(UX Component)" qualifiers
   - Reframe in flow language, not compliance language

4. **Check Distribution** (Section 4) — 5 minutes
   - Count approximate paragraphs per section
   - If regulatory >10%, trim or move to appendix

5. **Quick Read: Narrative Test** (Section 5) — 15 minutes
   - Skim regulatory section paragraphs
   - Rewrite 1-2 sentences from compliance language → UX language
   - Delete any pure legal/policy text (move to separate doc)

6. **Move/Verify Content** (Section 6) — 10 minutes
   - Highlight product-essential content (should stay in main)
   - Highlight pure-reference content (should move to appendix or separate doc)
   - Verify document still makes sense without regulatory section

7. **Final Checklist Pass** — 5 minutes
   - Run Single Test again
   - If PASS → ready for review

---

## 🎯 DOCUMENT REVIEW CHECKLIST (for Reviewer)

**When reviewing someone else's document**:

```markdown
☐ Single Test passes? (Can I read UX → Copy → Mechanics → Monetization?)
☐ Priority declaration exists in opening section?
☐ Regulatory section clearly marked "(UI-Only, Non-Narrative)"?
☐ Regulatory section <10% of total document?
☐ Safety/crisis/consent framed as UI components, not legal requirements?
☐ No legal jargon (GDPR, liability, warranty, terms) in Tier 0-3 sections?
☐ Can I move regulatory section to appendix without breaking document?
☐ Language is operational, not legal (focus on WHAT/HOW, not MUST/GDPR)?

If ANY unchecked:
- Comment with specific section + line numbers
- Suggest rewrite (use templates from Section 5 above)
- Approve only after author fixes
```

---

## 📚 TEMPLATE: For Future Documents

**Use this template when creating NEW operational documents**:

```markdown
# [DOCUMENT TITLE]
## [Subtitle]

**Version**: 1.0  
**Date**: [Today]  
**Audience**: [Team]  
**Status**: [DRAFT/OPERATIONAL BLUEPRINT]  
**Standard**: SUPER-PROMPT Systemowy (Non-negotiable)

---

### ⚠️ ABSOLUTE PRIORITY DECLARATION

[Copy from Section 1 checklist above]

---

## 📊 QUICK NAVIGATION

### This Document Contains:
✅ **UX/UI System** (design, flows, components)  
✅ **Copy/Tone System** (language rules, microcopy)  
✅ **Experience Mechanics** (interaction patterns, blocking logic)  
✅ **Monetization** (tier gating, conversion)  
⚠️ **Regulatory Components** (end-of-document, reference only)

---

[Main content: UX → Copy → Mechanics → Monetization]

---

## ⚠️ REGULATORY COMPONENTS (UI-Only, Non-Narrative)
### Reference Framework for Compliance Implementation

**Scope**: This section describes how compliance requirements are embedded into UI components...

[Regulatory content here, strictly operational language only]

---
```

---

## 🔄 HOW TO USE THIS CHECKLIST

**Scenario 1: Document Already Written**
→ Run Single Test first
→ If fails, do Sections 1-6 of Full Checklist
→ Estimated time: 60-90 minutes to fix

**Scenario 2: Writing New Document**
→ Use template from "📚 TEMPLATE" section above
→ Build in Section 1 from start (saves rewriting later)
→ Estimated time: saves 2-3 hours vs. editing after

**Scenario 3: Reviewing Someone Else's Document**
→ Use "🎯 DOCUMENT REVIEW CHECKLIST"
→ Provide feedback with specific section references
→ Estimated time: 30 minutes per document

---

## ❓ FREQUENTLY ASKED QUESTIONS

**Q: What if compliance genuinely needs to define a feature?**

A: Then it's not a compliance issue — it's a product requirement.
Reframe as: "System must block crisis input because [UX reason]" not "[legal reason]".
Then implement as UI component (CrisisModal), not compliance rule.

**Q: Can regulatory section ever be >10%?**

A: Only if it's a pure-reference document (like "Legal Compliance Audit").
For operational documents, regulatory >10% means compliance is competing with product for narrative space.
Solution: Split into two documents (product manual + legal reference).

**Q: What if the law requires specific language?**

A: Put the exact legal language in the UI component section.
Show the modal text, checkbox text, exact disclaimers.
This is "Regulatory Components" — specific UI text driven by legal.
Move legal explanation (why this language) to separate legal memo.

**Q: How do I test if my document "feels" right?**

A: Read the UX section, then skip to Monetization.
You should not need to read the Regulatory section to understand the product.
If you do, regulatory is woven into product logic (violation).

**Q: Is this checklist mandatory for every document?**

A: For strategic/operational documents: YES.
For tactical documents (daily standup notes, decision logs): NO.
For design specs, architecture docs, implementation guides: YES.

---

## 📞 ESCALATION

**If document is stuck**:

| Issue | Action |
|-------|--------|
| Can't make Single Test pass | Schedule 30-min sync. Often just framing issue, not structural problem. |
| Regulatory section genuinely complex | Consider splitting: (1) Product Manual, (2) Legal Reference Doc. They're different audiences. |
| Don't know where content belongs | Ask: "Is this essential to understand how the system works?" If YES → main. If NO → appendix. |
| Unsure about compliance language | Check MICRO-COPY-LIBRARY or SUPER-PROMPT standards. When in doubt, use operational language. |

---

## ✨ DONE

**This checklist ensures**:
- ✅ Every document respects UX → Copy → Mechanics → Monetization hierarchy
- ✅ Compliance is embedded as UI components, not as dominant narrative
- ✅ Legal/regulatory content is clearly bounded and optional
- ✅ Future documents start with correct framing (template provided)
- ✅ Team has clear test + workflow for auditing documents

**Use the Single Test as your north star. Everything else flows from that one question.**

---

**MASTER-EDITING-CHECKLIST v1.0**  
**Priority Audit Framework for SILENCE Documentation**  
**Generated**: 2026-01-16  
**For**: System Architecture Team, Product Leads, Technical Writers
