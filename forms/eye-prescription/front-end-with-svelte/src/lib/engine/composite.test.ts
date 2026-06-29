import { describe, it, expect } from 'vitest';
import { classify } from './composite.js';
import { createEmptyPrescription } from './factory.js';
import {
  classifySphere, classifyCylinder, classifyPresbyopia,
} from './refractive-rules.js';
import { computeComplexity } from './complexity-grader.js';
import { snapQuarter, ageInYears, suggestExpiry } from './utils.js';

describe('classifySphere', () => {
  it('emmetropia boundary', () => {
    expect(classifySphere(0)).toBe('emmetropia');
    expect(classifySphere(0.50)).toBe('emmetropia');
    expect(classifySphere(-0.50)).toBe('emmetropia');
    expect(classifySphere(null)).toBe('');
  });
  it('myopia bands', () => {
    expect(classifySphere(-0.75)).toBe('low-myopia');
    expect(classifySphere(-3.00)).toBe('low-myopia');
    expect(classifySphere(-3.25)).toBe('moderate-myopia');
    expect(classifySphere(-6.00)).toBe('moderate-myopia');
    expect(classifySphere(-6.25)).toBe('high-myopia');
    expect(classifySphere(-12)).toBe('high-myopia');
  });
  it('hyperopia bands', () => {
    expect(classifySphere(0.75)).toBe('low-hyperopia');
    expect(classifySphere(2.00)).toBe('low-hyperopia');
    expect(classifySphere(2.25)).toBe('moderate-hyperopia');
    expect(classifySphere(5.00)).toBe('moderate-hyperopia');
    expect(classifySphere(5.25)).toBe('high-hyperopia');
  });
});

describe('classifyCylinder', () => {
  it('uses magnitude', () => {
    expect(classifyCylinder(0)).toBe('none');
    expect(classifyCylinder(-0.25)).toBe('none');
    expect(classifyCylinder(-0.50)).toBe('mild-astigmatism');
    expect(classifyCylinder(-1.00)).toBe('mild-astigmatism');
    expect(classifyCylinder(-1.25)).toBe('moderate-astigmatism');
    expect(classifyCylinder(-2.50)).toBe('moderate-astigmatism');
    expect(classifyCylinder(-2.75)).toBe('high-astigmatism');
    expect(classifyCylinder(null)).toBe('');
  });
});

describe('classifyPresbyopia', () => {
  it('uses max of two eyes', () => {
    expect(classifyPresbyopia(null, null)).toBe('none');
    expect(classifyPresbyopia(0, 0)).toBe('none');
    expect(classifyPresbyopia(0.75, 0.50)).toBe('early-presbyopia');
    expect(classifyPresbyopia(1.50, 1.50)).toBe('early-presbyopia');
    expect(classifyPresbyopia(1.75, null)).toBe('established-presbyopia');
    expect(classifyPresbyopia(2.50, 2.50)).toBe('established-presbyopia');
    expect(classifyPresbyopia(2.75, null)).toBe('advanced-presbyopia');
  });
});

describe('computeComplexity', () => {
  it('all clear → simple', () => {
    expect(computeComplexity({
      rightEyeSphereClass: 'emmetropia',
      leftEyeSphereClass: 'emmetropia',
      rightEyeCylinderClass: 'none',
      leftEyeCylinderClass: 'none',
      presbyopiaClass: 'none',
      anisometropia: 0,
      prismPresent: false,
    })).toBe('simple');
  });
  it('moderate myopia → moderate', () => {
    expect(computeComplexity({
      rightEyeSphereClass: 'moderate-myopia',
      leftEyeSphereClass: 'low-myopia',
      rightEyeCylinderClass: 'none',
      leftEyeCylinderClass: 'none',
      presbyopiaClass: 'none',
      anisometropia: 0.5,
      prismPresent: false,
    })).toBe('moderate');
  });
  it('high astigmatism → complex', () => {
    expect(computeComplexity({
      rightEyeSphereClass: 'emmetropia',
      leftEyeSphereClass: 'emmetropia',
      rightEyeCylinderClass: 'high-astigmatism',
      leftEyeCylinderClass: 'none',
      presbyopiaClass: 'none',
      anisometropia: 0,
      prismPresent: false,
    })).toBe('complex');
  });
  it('prism → complex', () => {
    expect(computeComplexity({
      rightEyeSphereClass: 'emmetropia',
      leftEyeSphereClass: 'emmetropia',
      rightEyeCylinderClass: 'none',
      leftEyeCylinderClass: 'none',
      presbyopiaClass: 'none',
      anisometropia: 0,
      prismPresent: true,
    })).toBe('complex');
  });
  it('anisometropia > 2 D → complex', () => {
    expect(computeComplexity({
      rightEyeSphereClass: 'low-myopia',
      leftEyeSphereClass: 'low-myopia',
      rightEyeCylinderClass: 'none',
      leftEyeCylinderClass: 'none',
      presbyopiaClass: 'none',
      anisometropia: 2.5,
      prismPresent: false,
    })).toBe('complex');
  });
  it('presbyopia only → moderate', () => {
    expect(computeComplexity({
      rightEyeSphereClass: 'emmetropia',
      leftEyeSphereClass: 'emmetropia',
      rightEyeCylinderClass: 'none',
      leftEyeCylinderClass: 'none',
      presbyopiaClass: 'early-presbyopia',
      anisometropia: 0,
      prismPresent: false,
    })).toBe('moderate');
  });
});

describe('utils', () => {
  it('snapQuarter snaps to 0.25', () => {
    expect(snapQuarter(0)).toBe(0);
    expect(snapQuarter(-1.12)).toBe(-1);
    expect(snapQuarter(-1.13)).toBe(-1.25);
    expect(snapQuarter('1.5')).toBe(1.5);
    expect(snapQuarter('')).toBe(null);
    expect(snapQuarter(null)).toBe(null);
    expect(snapQuarter(NaN)).toBe(null);
  });
  it('ageInYears computes calendar age', () => {
    expect(ageInYears('1980-06-15', '2026-05-18')).toBe(45);
    expect(ageInYears('1980-06-15', '2026-06-15')).toBe(46);
    expect(ageInYears('1980-06-15', '2026-06-14')).toBe(45);
    expect(ageInYears('', '2026-05-18')).toBe(null);
  });
  it('suggestExpiry: adult → +2yr, paediatric/elderly → +1yr', () => {
    expect(suggestExpiry('1990-01-01', '2026-05-18')).toBe('2028-05-18');
    expect(suggestExpiry('2015-01-01', '2026-05-18')).toBe('2027-05-18');
    expect(suggestExpiry('1940-01-01', '2026-05-18')).toBe('2027-05-18');
  });
});

describe('classify end-to-end', () => {
  it('classifies a realistic complex case', () => {
    const p = createEmptyPrescription();
    p.patient.birthDate = '1978-02-28';
    p.examination.issueDate = '2026-05-18';
    p.examination.expiryDate = '2028-05-18';
    p.rightEye.sphereDiopters = -7.50;
    p.rightEye.cylinderDiopters = -2.75;
    p.rightEye.axisDegrees = 90;
    p.rightEye.additionDiopters = 2.00;
    p.rightEye.prismHorizontalDiopters = 1.00;
    p.rightEye.baseHorizontal = 'in';
    p.leftEye.sphereDiopters = -2.00;
    p.leftEye.cylinderDiopters = -0.50;
    p.leftEye.axisDegrees = 180;
    p.leftEye.additionDiopters = 2.00;
    const r = classify(p);
    expect(r.rightEyeSphereClass).toBe('high-myopia');
    expect(r.rightEyeCylinderClass).toBe('high-astigmatism');
    expect(r.leftEyeSphereClass).toBe('low-myopia');
    expect(r.presbyopiaClass).toBe('established-presbyopia');
    expect(r.anisometropia).toBe(5.5);
    expect(r.prismPresent).toBe(true);
    expect(r.complexity).toBe('complex');
    const categories = r.additionalFlags.map(f => f.category);
    expect(categories).toContain('high-myopia');
    expect(categories).toContain('high-astigmatism');
    expect(categories).toContain('anisometropia');
    expect(categories).toContain('prism-present');
    expect(categories).toContain('presbyopia');
    expect(r.additionalFlags.length).toBe(5);
  });

  it('classifies a simple case', () => {
    const p = createEmptyPrescription();
    p.patient.birthDate = '1995-01-01';
    p.examination.issueDate = '2026-05-18';
    p.rightEye.sphereDiopters = -1.50;
    p.rightEye.cylinderDiopters = -0.25;
    p.leftEye.sphereDiopters = -1.25;
    p.leftEye.cylinderDiopters = 0;
    const r = classify(p);
    expect(r.complexity).toBe('simple');
    expect(r.additionalFlags.length).toBe(0);
  });

  it('paediatric and expired flags fire', () => {
    const p = createEmptyPrescription();
    p.patient.birthDate = '2018-01-01';
    p.examination.issueDate = '2024-05-18';
    p.examination.expiryDate = '2024-06-18';
    const r = classify(p);
    const cats = r.additionalFlags.map(f => f.category);
    expect(cats).toContain('paediatric');
    expect(cats).toContain('prescription-expired');
  });
});
