// Small pure helpers shared by every other engine file. Pure functions,
// no side effects. Published on `window.MedicalOperationNote`.

(function () {
'use strict';
window.MedicalOperationNote =
  window.MedicalOperationNote || {};
const NS = window.MedicalOperationNote;
const { COMPOSITE_RISK_ORDER, CLAVIEN_DINDO_ORDER, EBL_BAND_ORDER } = NS;

/** HTML-escape a string for safe injection into innerHTML. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Return whichever of two composite-risk bands is more severe. */
function maxCompositeRisk(a, b) {
  const ai = COMPOSITE_RISK_ORDER.indexOf(a);
  const bi = COMPOSITE_RISK_ORDER.indexOf(b);
  if (ai < 0) return b;
  if (bi < 0) return a;
  return ai >= bi ? a : b;
}

/** Return whichever of two Clavien-Dindo grades is more severe. */
function maxClavienDindo(a, b) {
  const ai = CLAVIEN_DINDO_ORDER.indexOf(a);
  const bi = CLAVIEN_DINDO_ORDER.indexOf(b);
  if (ai < 0) return b;
  if (bi < 0) return a;
  return ai >= bi ? a : b;
}

/** Return whichever of two EBL bands is more severe. */
function maxBloodLossBand(a, b) {
  const ai = EBL_BAND_ORDER.indexOf(a);
  const bi = EBL_BAND_ORDER.indexOf(b);
  if (ai < 0) return b;
  if (bi < 0) return a;
  return ai >= bi ? a : b;
}

/** Map a Clavien-Dindo grade to its corresponding composite-risk band. */
function clavienToCompositeRisk(grade) {
  switch (grade) {
    case '0':    return 'routine';
    case 'I':    return 'complicated';
    case 'II':   return 'complicated';
    case 'IIIa': return 'high-risk';
    case 'IIIb': return 'high-risk';
    case 'IVa':  return 'critical';
    case 'IVb':  return 'critical';
    case 'V':    return 'critical';
    default:     return 'routine';
  }
}

/** Map an EBL band to its corresponding composite-risk band. */
function eblToCompositeRisk(band) {
  switch (band) {
    case 'minimal':  return 'routine';
    case 'mild':     return 'routine';
    case 'moderate': return 'complicated';
    case 'severe':   return 'high-risk';
    case 'massive':  return 'critical';
    default:         return 'routine';
  }
}

/** Sum a list of numeric-or-null values, treating null as 0. */
function sumOrZero(list) {
  return list.reduce((acc, v) => acc + (Number(v) || 0), 0);
}

/** Format a timestamp for display. */
function formatTimestamp(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch (_e) {
    return String(iso);
  }
}

Object.assign(NS, {
  esc,
  maxCompositeRisk,
  maxClavienDindo,
  maxBloodLossBand,
  clavienToCompositeRisk,
  eblToCompositeRisk,
  sumOrZero,
  formatTimestamp
});
})();
