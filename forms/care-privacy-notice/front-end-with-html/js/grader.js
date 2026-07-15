// Grading engine — simple completeness check for acknowledgment step.
//
// Exposed both as an ES module export and as a classic-script namespace
// value so the page can be opened directly via file:// without CORS
// blocking ES module loading.

function grade(data) {
  const firedRules = [];

  if (!data.acknowledgment.checked) {
    firedRules.push({
      id: 'acknowledgment-not-checked',
      message: 'Patient has not checked the acknowledgment box.'
    });
  }

  if (
    !data.acknowledgment.patientName ||
    data.acknowledgment.patientName.trim() === ''
  ) {
    firedRules.push({
      id: 'name-blank',
      message: 'Patient name is required.'
    });
  }

  if (
    !data.acknowledgment.date ||
    data.acknowledgment.date.trim() === ''
  ) {
    firedRules.push({
      id: 'date-blank',
      message: 'Date is required.'
    });
  }

  const overallStatus = firedRules.length === 0 ? 'complete' : 'incomplete';
  return { overallStatus, firedRules };
}

export { grade };
