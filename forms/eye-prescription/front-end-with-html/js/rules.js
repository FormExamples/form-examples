// Eye Prescription — classification engine.
//
// Pure functions: no DOM, no IO. Three passes:
//   1. Per-eye refractive class (sphere band + cylinder band).
//   2. Patient-level findings (anisometropia, presbyopia, prism, change).
//   3. Complexity composite (worst-of).
//
// Safety flags fire independently. See
// ../doc/refractive-classification-rules.md for the band tables.

(function () {
  'use strict';
  const NS = (window.EyePrescription = window.EyePrescription || {});
  const { ageInYears } = NS;

  // ----------------------------------------------------------------------
  // Per-eye sphere class
  // ----------------------------------------------------------------------
  function classifySphere(sphere) {
    if (sphere === null || sphere === undefined) return '';
    if (sphere < -6.00) return 'high-myopia';
    if (sphere <= -3.25) return 'moderate-myopia';
    if (sphere <= -0.75) return 'low-myopia';
    if (sphere <= 0.50 && sphere >= -0.50) return 'emmetropia';
    if (sphere <= 2.00) return 'low-hyperopia';
    if (sphere <= 5.00) return 'moderate-hyperopia';
    return 'high-hyperopia';
  }

  // ----------------------------------------------------------------------
  // Per-eye cylinder class (input is stored ≤ 0; magnitude = abs)
  // ----------------------------------------------------------------------
  function classifyCylinder(cylinder) {
    if (cylinder === null || cylinder === undefined) return '';
    const m = Math.abs(cylinder);
    if (m < 0.50) return 'none';
    if (m <= 1.00) return 'mild-astigmatism';
    if (m <= 2.50) return 'moderate-astigmatism';
    return 'high-astigmatism';
  }

  // ----------------------------------------------------------------------
  // Presbyopia class (addition is always positive)
  // ----------------------------------------------------------------------
  function classifyPresbyopia(addRight, addLeft) {
    const a = Math.max(addRight || 0, addLeft || 0);
    if (a < 0.75) return 'none';
    if (a <= 1.50) return 'early-presbyopia';
    if (a <= 2.50) return 'established-presbyopia';
    return 'advanced-presbyopia';
  }

  function anisometropiaDiopters(p) {
    const r = p.rightEye.sphereDiopters;
    const l = p.leftEye.sphereDiopters;
    if (r === null || l === null) return null;
    return Math.abs(r - l);
  }

  function prismPresent(p) {
    return (
      (p.rightEye.prismHorizontalDiopters || 0) > 0 ||
      (p.rightEye.prismVerticalDiopters || 0) > 0 ||
      (p.leftEye.prismHorizontalDiopters || 0) > 0 ||
      (p.leftEye.prismVerticalDiopters || 0) > 0
    );
  }

  function isHighBand(sphereClass, cylClass) {
    return (
      sphereClass === 'high-myopia' ||
      sphereClass === 'high-hyperopia' ||
      cylClass === 'high-astigmatism'
    );
  }
  function isModerateBand(sphereClass, cylClass) {
    return (
      sphereClass === 'moderate-myopia' ||
      sphereClass === 'moderate-hyperopia' ||
      cylClass === 'moderate-astigmatism'
    );
  }

  // ----------------------------------------------------------------------
  // Composite complexity
  // ----------------------------------------------------------------------
  function computeComplexity(result) {
    const {
      rightEyeSphereClass: rs,
      rightEyeCylinderClass: rc,
      leftEyeSphereClass: ls,
      leftEyeCylinderClass: lc,
      presbyopiaClass,
      anisometropia,
      prismPresent: prism
    } = result;
    if (isHighBand(rs, rc) || isHighBand(ls, lc)) return 'complex';
    if (prism) return 'complex';
    if (anisometropia !== null && anisometropia > 2.00) return 'complex';
    if (presbyopiaClass !== 'none' && presbyopiaClass !== '') return 'moderate';
    if (isModerateBand(rs, rc) || isModerateBand(ls, lc)) return 'moderate';
    return 'simple';
  }

  // ----------------------------------------------------------------------
  // Fired rules (audit trail)
  // ----------------------------------------------------------------------
  function makeFiredRules(p, result) {
    const rules = [];
    function add(ruleId, instrument, eye, klass, category, description) {
      rules.push({ ruleId, instrument, eye, class: klass, category, description });
    }
    if (result.rightEyeSphereClass)
      add('R-SPH-' + result.rightEyeSphereClass.toUpperCase(), 'sphere', 'right', result.rightEyeSphereClass, 'refraction',
          `Right sphere ${p.rightEye.sphereDiopters} D → ${result.rightEyeSphereClass}`);
    if (result.leftEyeSphereClass)
      add('R-SPH-' + result.leftEyeSphereClass.toUpperCase(), 'sphere', 'left', result.leftEyeSphereClass, 'refraction',
          `Left sphere ${p.leftEye.sphereDiopters} D → ${result.leftEyeSphereClass}`);
    if (result.rightEyeCylinderClass && result.rightEyeCylinderClass !== 'none')
      add('R-CYL-' + result.rightEyeCylinderClass.toUpperCase(), 'cylinder', 'right', result.rightEyeCylinderClass, 'refraction',
          `Right cylinder ${p.rightEye.cylinderDiopters} D → ${result.rightEyeCylinderClass}`);
    if (result.leftEyeCylinderClass && result.leftEyeCylinderClass !== 'none')
      add('R-CYL-' + result.leftEyeCylinderClass.toUpperCase(), 'cylinder', 'left', result.leftEyeCylinderClass, 'refraction',
          `Left cylinder ${p.leftEye.cylinderDiopters} D → ${result.leftEyeCylinderClass}`);
    if (result.presbyopiaClass && result.presbyopiaClass !== 'none')
      add('R-ADD-' + result.presbyopiaClass.toUpperCase(), 'addition', 'both', result.presbyopiaClass, 'accommodation',
          `Addition → ${result.presbyopiaClass}`);
    if (result.anisometropia !== null && result.anisometropia > 0.50)
      add('R-ANISO-01', 'anisometropia', 'both', '', 'alignment',
          `Anisometropia ${result.anisometropia.toFixed(2)} D`);
    if (result.prismPresent)
      add('R-PRISM-01', 'prism', 'both', '', 'alignment', 'Prism prescribed');
    return rules;
  }

  // ----------------------------------------------------------------------
  // Safety flags
  // ----------------------------------------------------------------------
  function makeFlags(p, result) {
    const flags = [];
    let i = 0;
    function add(category, eye, priority, description, action) {
      i += 1;
      flags.push({
        flagId: `F-${category.toUpperCase()}-${String(i).padStart(3, '0')}`,
        category, eye, priority, description, suggestedAction: action
      });
    }

    const rs = p.rightEye.sphereDiopters;
    const ls = p.leftEye.sphereDiopters;
    const rc = p.rightEye.cylinderDiopters;
    const lc = p.leftEye.cylinderDiopters;

    if (rs !== null && rs < -6.00)
      add('high-myopia', 'right', 'medium',
          `Right sphere ${rs} D below -6.00 D`,
          'Consider retinal screening every 12 months');
    if (ls !== null && ls < -6.00)
      add('high-myopia', 'left', 'medium',
          `Left sphere ${ls} D below -6.00 D`,
          'Consider retinal screening every 12 months');
    if (rs !== null && rs > 5.00)
      add('high-hyperopia', 'right', 'medium',
          `Right sphere ${rs} D above +5.00 D`,
          'Assess angle-closure risk; gonioscopy if indicated');
    if (ls !== null && ls > 5.00)
      add('high-hyperopia', 'left', 'medium',
          `Left sphere ${ls} D above +5.00 D`,
          'Assess angle-closure risk; gonioscopy if indicated');
    if (rc !== null && Math.abs(rc) > 2.50)
      add('high-astigmatism', 'right', 'medium',
          `Right cylinder ${rc} D magnitude > 2.50 D`,
          'Consider corneal topography; rule out keratoconus');
    if (lc !== null && Math.abs(lc) > 2.50)
      add('high-astigmatism', 'left', 'medium',
          `Left cylinder ${lc} D magnitude > 2.50 D`,
          'Consider corneal topography; rule out keratoconus');
    if (result.anisometropia !== null && result.anisometropia > 2.00)
      add('anisometropia', 'both', 'medium',
          `Anisometropia ${result.anisometropia.toFixed(2)} D > 2.00 D`,
          'Adaptation period expected; consider contact-lens correction');
    if (result.prismPresent)
      add('prism-present', 'both', 'medium',
          'Prism prescribed in one or both eyes',
          'Document indication; review binocular vision');
    if (result.presbyopiaClass && result.presbyopiaClass !== 'none')
      add('presbyopia', 'both', 'low',
          `Addition prescribed (${result.presbyopiaClass})`,
          'Counsel patient on accommodation expectations');

    const age = ageInYears(p.patient.birthDate, p.examination.issueDate);
    if (age !== null && age < 16)
      add('paediatric', 'both', 'medium',
          `Patient age ${age} years < 16`,
          'Use polycarbonate or Trivex; expiry default 1 year');

    if (p.examination.expiryDate) {
      const today = new Date();
      const expiry = new Date(p.examination.expiryDate);
      if (expiry < today)
        add('prescription-expired', 'both', 'high',
            `Expiry date ${p.examination.expiryDate} is in the past`,
            'Schedule a new sight test before dispensing');
    }

    // Significant change vs. prior
    const psr = p.examination.priorSphereRight;
    const psl = p.examination.priorSphereLeft;
    if (psr !== null && rs !== null && Math.abs(rs - psr) > 1.00)
      add('significant-change-from-prior', 'right', 'low',
          `Right sphere changed by ${(rs - psr).toFixed(2)} D since prior`,
          'Counsel patient on adaptation period');
    if (psl !== null && ls !== null && Math.abs(ls - psl) > 1.00)
      add('significant-change-from-prior', 'left', 'low',
          `Left sphere changed by ${(ls - psl).toFixed(2)} D since prior`,
          'Counsel patient on adaptation period');

    if (p.ocularHealth.pathologyFlag)
      add('ocular-pathology', 'both', 'high',
          'Ocular pathology recorded on step 10',
          'Consider ophthalmology referral as documented');

    if (p.ocularHealth.referOphthalmology)
      add('refer-ophthalmology', 'both', 'high',
          'Prescriber requests ophthalmology referral',
          p.ocularHealth.referralReason || 'See step 10 notes');

    return flags;
  }

  // ----------------------------------------------------------------------
  // Entry point
  // ----------------------------------------------------------------------
  function classify(p) {
    const result = {
      rightEyeSphereClass: classifySphere(p.rightEye.sphereDiopters),
      leftEyeSphereClass: classifySphere(p.leftEye.sphereDiopters),
      rightEyeCylinderClass: classifyCylinder(p.rightEye.cylinderDiopters),
      leftEyeCylinderClass: classifyCylinder(p.leftEye.cylinderDiopters),
      presbyopiaClass: classifyPresbyopia(
        p.rightEye.additionDiopters,
        p.leftEye.additionDiopters
      ),
      anisometropia: anisometropiaDiopters(p),
      prismPresent: prismPresent(p)
    };
    result.complexity = computeComplexity(result);
    result.firedRules = makeFiredRules(p, result);
    result.additionalFlags = makeFlags(p, result);
    return result;
  }

  // Default expiry: issue + 2 years (or +1 year if <16 or ≥70 on issue).
  function suggestExpiry(birthDate, issueDate) {
    if (!issueDate) return '';
    const age = ageInYears(birthDate, issueDate);
    const issue = new Date(issueDate);
    const years = (age !== null && (age < 16 || age >= 70)) ? 1 : 2;
    const expiry = new Date(issue);
    expiry.setFullYear(issue.getFullYear() + years);
    return expiry.toISOString().slice(0, 10);
  }

  NS.classify = classify;
  NS.classifySphere = classifySphere;
  NS.classifyCylinder = classifyCylinder;
  NS.classifyPresbyopia = classifyPresbyopia;
  NS.suggestExpiry = suggestExpiry;
}());
