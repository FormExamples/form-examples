// Required-field validation rules for the Code of Conduct Notice form.
// Ported 1:1 from `src/lib/engine/validation-rules.ts`.

/**
 * @typedef {import('./types.js').ValidationRule} ValidationRule
 */

/** @type {ValidationRule[]} */
const validationRules = [
  // Recipient Details
  {
    id: 'REQ-RD-001',
    section: 'recipientDetails',
    field: 'organisationName',
    message: 'Organisation name is required'
  },
  {
    id: 'REQ-RD-002',
    section: 'recipientDetails',
    field: 'recipientName',
    message: 'Recipient name is required'
  },
  {
    id: 'REQ-RD-003',
    section: 'recipientDetails',
    field: 'recipientRole',
    message: 'Recipient role is required'
  },

  // Acknowledgement & Signature
  {
    id: 'REQ-AK-001',
    section: 'acknowledgementSignature',
    field: 'agreed',
    message: 'Recipient must check the acknowledgement checkbox'
  },
  {
    id: 'REQ-AK-002',
    section: 'acknowledgementSignature',
    field: 'recipientTypedFullName',
    message: 'Recipient must type their full name'
  },
  {
    id: 'REQ-AK-003',
    section: 'acknowledgementSignature',
    field: 'recipientTypedDate',
    message: "Recipient must enter today's date"
  }
];

export { validationRules };
