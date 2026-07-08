// Mallampati / Airway difficulty risk rules.
//
// Inputs: Mallampati class, mouth opening (cm), thyromental distance (cm),
// neck mobility, dentition, jaw protrusion, and difficult-intubation
// history (from Step 6 — Previous Anaesthesia).
//
// MALL-001  Mallampati class III   -> medium-risk factor
// MALL-002  Mallampati class IV    -> high risk
// MALL-003  Mouth opening <3cm     -> medium-risk factor
// MALL-004  Thyromental <6.5cm     -> medium-risk factor
// MALL-005  Limited neck mobility  -> medium-risk factor
// MALL-006  Loose teeth or prominent incisors -> medium-risk factor
// MALL-007  Jaw protrusion limited -> medium-risk factor
// MALL-008  Difficult intubation history -> high risk
//
// Composition:
//   - Mallampati IV OR difficult-intubation history -> high
//   - >= 2 medium factors -> high
//   - any single medium factor -> medium
//   - otherwise -> low

(function () {
'use strict';
window.AnesthesiologyAssessment = window.AnesthesiologyAssessment || {};

function mallampatiLabel(klass) {
  switch (klass) {
    case 'i': return 'Mallampati Class I';
    case 'ii': return 'Mallampati Class II';
    case 'iii': return 'Mallampati Class III';
    case 'iv': return 'Mallampati Class IV';
    default: return '';
  }
}

function evaluateAirway(d) {
  const ex = d.physicalExam;
  const prev = d.previousAnaesthesia;
  const firedRules = [];
  let highRisk = false;
  let mediumCount = 0;

  if (ex.mallampatiClass === 'iv') {
    highRisk = true;
    firedRules.push({
      id: 'MALL-002',
      category: 'Airway',
      description: 'Mallampati Class IV — high airway difficulty risk.',
      riskLevel: 'high'
    });
  } else if (ex.mallampatiClass === 'iii') {
    mediumCount++;
    firedRules.push({
      id: 'MALL-001',
      category: 'Airway',
      description: 'Mallampati Class III — moderate airway difficulty risk factor.',
      riskLevel: 'medium'
    });
  }

  if (prev.difficultIntubation) {
    highRisk = true;
    firedRules.push({
      id: 'MALL-008',
      category: 'Airway',
      description: 'Previous difficult intubation — high airway difficulty risk.',
      riskLevel: 'high'
    });
  }

  if (ex.mouthOpening !== null && ex.mouthOpening !== undefined && ex.mouthOpening < 3) {
    mediumCount++;
    firedRules.push({
      id: 'MALL-003',
      category: 'Airway',
      description: `Mouth opening ${ex.mouthOpening} cm (<3cm) — limited oral access.`,
      riskLevel: 'medium'
    });
  }

  if (
    ex.thyromentalDistance !== null &&
    ex.thyromentalDistance !== undefined &&
    ex.thyromentalDistance < 6.5
  ) {
    mediumCount++;
    firedRules.push({
      id: 'MALL-004',
      category: 'Airway',
      description: `Thyromental distance ${ex.thyromentalDistance} cm (<6.5cm) — anterior larynx risk.`,
      riskLevel: 'medium'
    });
  }

  if (ex.neckMobility === 'limited' || ex.neckMobility === 'fixed') {
    mediumCount++;
    firedRules.push({
      id: 'MALL-005',
      category: 'Airway',
      description: `Neck mobility ${ex.neckMobility} — restricted laryngoscopy.`,
      riskLevel: ex.neckMobility === 'fixed' ? 'high' : 'medium'
    });
    if (ex.neckMobility === 'fixed') highRisk = true;
  }

  if (ex.dentitionLooseTeeth || ex.dentitionProminentIncisors) {
    mediumCount++;
    const detail = [
      ex.dentitionLooseTeeth ? 'loose teeth' : null,
      ex.dentitionProminentIncisors ? 'prominent incisors' : null
    ].filter(Boolean).join(' and ');
    firedRules.push({
      id: 'MALL-006',
      category: 'Airway',
      description: `Adverse dentition (${detail}) — care during intubation.`,
      riskLevel: 'medium'
    });
  }

  if (ex.jawProtrusion === 'limited') {
    mediumCount++;
    firedRules.push({
      id: 'MALL-007',
      category: 'Airway',
      description: 'Limited jaw protrusion — reduced laryngoscopic view.',
      riskLevel: 'medium'
    });
  }

  let riskLevel = 'low';
  if (highRisk || mediumCount >= 2) riskLevel = 'high';
  else if (mediumCount >= 1) riskLevel = 'medium';

  return {
    mallampatiClass: ex.mallampatiClass || '',
    mediumFactors: mediumCount,
    riskLevel,
    firedRules
  };
}

Object.assign(window.AnesthesiologyAssessment, {
  mallampatiLabel,
  evaluateAirway
});
})();
