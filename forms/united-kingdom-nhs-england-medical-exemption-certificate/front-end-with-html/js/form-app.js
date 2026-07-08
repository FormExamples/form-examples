/**
 * FP92A — single-page step-by-step wizard controller.
 *
 * Manages step navigation, persists data to localStorage, and renders the
 * eligibility summary on the final step.
 */

(function (root) {
  const F = root.Fp92aForm;
  const STORAGE_KEY = "fp92a.application.v1";
  const TOTAL = F.TOTAL_STEPS;

  const form = document.getElementById("application-form");
  const steps = Array.from(document.querySelectorAll(".step"));
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress");
  const stepList = document.getElementById("step-list");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const summary = document.getElementById("summary");
  const ageInput = form.querySelector('[name="ageDisplay"]');
  const ageAdvice = document.getElementById("age-advice");
  const pregnancyAdvice = document.getElementById("pregnancy-advice");

  let current = 1;
  let data = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collect())); } catch {}
  }

  function renderStepList() {
    if (!stepList) return;
    stepList.innerHTML = "";
    for (let i = 1; i <= TOTAL; i++) {
      const li = document.createElement("li");
      li.className = "step-list-item";
      li.dataset.status = "waiting";
      li.dataset.step = String(i);
      li.setAttribute("aria-label", "Step " + i + ": " + (F.STEP_TITLES[i - 1] || ""));
      const span = document.createElement("span");
      span.textContent = (F.STEP_TITLES[i - 1] || ("Step " + i));
      li.appendChild(span);
      li.addEventListener("click", () => { persist(); showStep(i); });
      stepList.appendChild(li);
    }
  }

  function updateStepListStatuses() {
    if (!stepList) return;
    for (let i = 1; i <= TOTAL; i++) {
      const li = stepList.querySelector('[data-step="' + i + '"]');
      if (!li) continue;
      if (i < current) {
        li.dataset.status = "finished";
        li.removeAttribute("aria-current");
      } else if (i === current) {
        li.dataset.status = "in-progress";
        li.setAttribute("aria-current", "step");
      } else {
        li.dataset.status = "waiting";
        li.removeAttribute("aria-current");
      }
    }
    stepList.dataset.current = String(current - 1);
  }

  function showStep(n) {
    current = Math.min(TOTAL, Math.max(1, n));
    steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== current; });
    progressText.textContent = `Step ${current} of ${TOTAL} — ${F.STEP_TITLES[current - 1]}`;
    if (progressBar) progressBar.value = Math.round((current / TOTAL) * 100);
    prevBtn.disabled = current === 1;
    nextBtn.hidden = current === TOTAL;
    submitBtn.hidden = current !== TOTAL;
    updateStepListStatuses();
    if (current === 10) renderSummary();
  }

  function collect() {
    const fd = new FormData(form);
    const obj = {};
    for (const [k, v] of fd.entries()) {
      if (k === "condition") continue;
      obj[k] = v;
    }
    obj.conditions = Array.from(form.querySelectorAll('input[name="condition"]:checked'))
      .map((el) => el.value);
    return obj;
  }

  function buildApplicationData(raw) {
    return {
      // practitioner
      practitionerName: raw.practitionerName || "",
      practitionerRole: raw.practitionerRole || "",
      registrationBody: raw.registrationBody || "",
      registrationNumber: raw.registrationNumber || "",
      practiceName: raw.practiceName || "",
      practiceCode: raw.practiceCode || "",
      practiceAddress: raw.practiceAddress || "",
      practicePostcode: raw.practicePostcode || "",
      practicePhone: raw.practicePhone || "",
      completedDate: raw.completedDate || "",
      // patient
      patientTitle: raw.patientTitle || "",
      patientSurname: raw.patientSurname || "",
      patientForenames: raw.patientForenames || "",
      patientBirthDate: raw.patientBirthDate || "",
      patientSex: raw.patientSex || "",
      patientNhsNumber: raw.patientNhsNumber || "",
      patientAddress: raw.patientAddress || "",
      patientPostcode: raw.patientPostcode || "",
      patientPhone: raw.patientPhone || "",
      patientEmail: raw.patientEmail || "",
      // existing
      applicationKind: raw.applicationKind || "new",
      previousCertificateNumber: raw.previousCertificateNumber || "",
      previousCertificateExpiry: raw.previousCertificateExpiry || "",
      // age / education
      fullTimeEducation: raw.fullTimeEducation || "",
      // pregnancy
      pregnancyStatus: raw.pregnancyStatus || "",
      // conditions
      conditions: raw.conditions || [],
      diagnosisDate: raw.diagnosisDate || "",
      snomedCode: raw.snomedCode || "",
      icd10Code: raw.icd10Code || "",
      treatmentDetail: raw.treatmentDetail || "",
      diabetesTreatmentMode: raw.diabetesTreatmentMode || "",
      cancerSite: raw.cancerSite || "",
      cancerTreatmentPhase: raw.cancerTreatmentPhase || "",
      // attestation
      fistulaSite: raw.fistulaSite || "",
      applianceType: raw.applianceType || "",
      cannotLeaveHomeUnaided: raw.cannotLeaveHomeUnaided || "",
      disabilityPermanent: raw.disabilityPermanent || "",
      carerDetail: raw.carerDetail || "",
      // declaration
      practitionerDeclaration: raw.practitionerDeclaration || "",
      signaturePresent: raw.signaturePresent || "",
      signedDate: raw.signedDate || "",
    };
  }

  function renderSummary() {
    const app = buildApplicationData(collect());
    const result = F.evaluateFp92a(app);
    const label = result.outcome === "eligible" ? "Eligible"
      : result.outcome === "ineligible" ? "Ineligible"
      : "Requires clarification";
    const conditions = result.eligibleConditions
      .map((c) => F.ELIGIBLE_CONDITION_LABELS[c] || c)
      .join(", ") || "(none)";
    const rulesHtml = result.firedRules.map((r) =>
      `<li><strong>${r.category}</strong> — ${r.description}</li>`).join("");
    const flagsHtml = result.additionalFlags.map((f) =>
      `<li><strong>[${f.priority}]</strong> ${f.description}</li>`).join("");
    summary.innerHTML = `
      <h3>Eligibility outcome</h3>
      <p><span class="outcome ${result.outcome}">${label}</span>
         ${result.redirectTo ? `Redirect to <strong>${result.redirectTo}</strong>.` : ""}</p>
      <p><strong>Eligible conditions declared:</strong> ${conditions}</p>
      <p><strong>Valid from:</strong> ${result.validFrom || "—"}
         &nbsp; <strong>Valid until:</strong> ${result.validUntil || "—"}</p>
      <h3>Fired rules</h3>
      ${rulesHtml ? `<ul>${rulesHtml}</ul>` : "<p>(none)</p>"}
      <h3>Advisory flags</h3>
      ${flagsHtml ? `<ul>${flagsHtml}</ul>` : "<p>(none)</p>"}
      <p class="muted">Print this form, sign in ink, and post the original FP92A to NHSBSA Bridge House.</p>
    `;
  }

  function updateAgeDisplay() {
    const dob = form.querySelector('[name="patientBirthDate"]').value;
    const age = F.ageYears(dob);
    if (ageInput) ageInput.value = age == null ? "" : `${age} years`;
    if (!ageAdvice) return;
    ageAdvice.innerHTML = "";
    if (age == null) return;
    if (age >= 60) ageAdvice.textContent = "Patient is 60+ — entitled to free prescriptions on age grounds. FP92A not required.";
    else if (age < 16) ageAdvice.textContent = "Patient is under 16 — entitled on age grounds.";
    else if (age >= 16 && age <= 18) ageAdvice.textContent = "Patient is 16-18 — entitled on age grounds if in full-time education.";
  }

  function updatePregnancyAdvice() {
    if (!pregnancyAdvice) return;
    const v = form.querySelector('[name="pregnancyStatus"]').value;
    pregnancyAdvice.innerHTML = "";
    if (v === "pregnant" || v === "post-partum-within-12-months") {
      pregnancyAdvice.textContent = "Direct the applicant to FW8 (maternity exemption) — that route is faster.";
    }
  }

  function rehydrate() {
    for (const [k, v] of Object.entries(data)) {
      if (k === "conditions" && Array.isArray(v)) {
        v.forEach((code) => {
          const cb = form.querySelector(`input[name="condition"][value="${code}"]`);
          if (cb) cb.checked = true;
        });
        continue;
      }
      const el = form.elements.namedItem(k);
      if (el && "value" in el) el.value = v;
    }
    updateAgeDisplay();
    updatePregnancyAdvice();
  }

  prevBtn.addEventListener("click", () => showStep(current - 1));
  nextBtn.addEventListener("click", () => { persist(); showStep(current + 1); });
  submitBtn.addEventListener("click", () => { persist(); renderSummary(); });
  resetBtn.addEventListener("click", () => {
    if (!confirm("Discard all answers?")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    form.reset();
    data = {};
    summary.innerHTML = "";
    showStep(1);
  });
  form.addEventListener("input", () => {
    persist();
    if (current === 4) updateAgeDisplay();
    if (current === 5) updatePregnancyAdvice();
  });

  renderStepList();
  rehydrate();
  showStep(1);
})(window);
