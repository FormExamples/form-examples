import { CRITERIA, SECTIONS } from './criteria.js';

// Data model. Empty string = unanswered; null = unanswered date.
function emptyAssessment() {
  const criteria = {};
  for (const c of CRITERIA) criteria[c.id] = '';
  const notes = {};
  for (const s of SECTIONS) notes[s.id] = '';
  return {
    supplier: {
      name: '', tradingName: '', companyRegistrationNumber: '', countryOfRegistration: '',
      icoRegistrationNumber: '', website: '', postalAddress: '', postcode: '',
      contactName: '', contactEmail: '', contactPhone: ''
    },
    product: {
      name: '', version: '', description: '', intendedPurpose: '', productType: '',
      medicalDeviceClass: '', handlesPatientData: '', isPatientFacing: ''
    },
    assessor: { name: '', email: '', phone: '', organisation: '', role: '' },
    assessment: {
      status: 'draft', assessmentDate: null, reviewDueDate: null, dtacVersion: '',
      commissioningOrganisation: '', assessorNotes: '',
      finalOutcome: '', assessorOverrideReason: ''
    },
    criteria,
    notes
  };
}

export { emptyAssessment };
