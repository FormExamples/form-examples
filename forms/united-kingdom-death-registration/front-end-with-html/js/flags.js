import { DEADLINE_DAYS, coronerCleared, coronerPending, coronerReferred, daysSinceConfirmation, deadlineStatus, informantQualified, isRegistered, nonEmpty } from './rules.js';

// Flagged-issue detection (deadline, statutory, documentary and practical).
// Independent of the registration class (which the grader produces), this
// module raises family- and registrar-facing flags per spec section 5. Rows
// mirror the `united_kingdom_death_registration_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). Nothing here is
// legal advice.

/**
 * @typedef {import('./types.js').Registration} Registration
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {Registration} d
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(d) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const push = (id, category, priority, description, suggestedAction) =>
    flags.push({ id, category, priority, description, suggestedAction });
  const registered = isRegistered(d);
  const status = deadlineStatus(d);
  const days = daysSinceConfirmation(d);

  // Jurisdiction (HIGH)
  if (d.deceased.deathJurisdiction !== '' && d.deceased.deathJurisdiction !== 'england-wales') {
    push('F-JURISDICTION-001', 'jurisdiction', 'high',
      'The death did not occur in England or Wales. This process does not apply; Scotland, Northern Ireland and deaths abroad have their own registration rules and deadlines.',
      'Register with the registrar for the country where the death occurred, or with the FCDO for a death abroad.');
  }

  // Coroner pending (HIGH)
  if (coronerPending(d)) {
    push('F-CORONER-PENDING-001', 'coroner', 'high',
      'The death has been reported to a coroner and the coroner’s certificate has not been received. The death cannot be registered yet.',
      'Wait for the coroner to send the certificate (form CN2, or the certificate after inquest) to the registrar; ask the coroner for an interim certificate if proof of death is needed meanwhile.');
  } else if (coronerCleared(d)) {
    push('F-CORONER-RELEASED-001', 'coroner', 'low',
      'The coroner has released the death. Registration proceeds on the coroner’s certificate; for a cremation the coroner also sends the Cremation 6 certificate.',
      'Book the registration appointment; the registrar will contact the informant.');
  }

  // MCCD and medical examiner (HIGH), only on the non-coroner path
  if (!coronerReferred(d) && d.coroner.referredToCoroner === 'no') {
    if (d.medical.mccdReceived !== 'yes') {
      push('F-MCCD-MISSING-001', 'medical-certificate', 'high',
        'The medical certificate of cause of death (MCCD) has not been received by the register office.',
        'Ask the doctor or hospital bereavement office to send the MCCD to the register office.');
    }
    if (d.medical.medicalExaminerStatus !== 'confirmed') {
      push('F-MEDICAL-EXAMINER-001', 'medical-examiner', 'high',
        'The medical examiner has not confirmed that the death can be registered, so the 5-day clock has not started.',
        'Wait for the medical examiner’s office to contact the informant; do not book to register before then.');
    }
  }

  // Informant (HIGH)
  if (nonEmpty(d.informant.informantName) && !informantQualified(d)) {
    push('F-INFORMANT-001', 'informant', 'high',
      'The informant is not a qualified informant. Only a relative, a person present at the death, the occupier of the premises, or the person arranging the funeral can register.',
      'Ask a qualified informant to register the death, or check the registrar’s guidance for exceptions.');
  }
  if (d.deceased.deceasedParticularsKnown === 'no') {
    push('F-PARTICULARS-001', 'informant', 'medium',
      'The informant cannot give the deceased’s full particulars (names, birth date and place, last address, occupation, marital status).',
      'Gather the particulars from a relative or the deceased’s documents before the appointment.');
  }

  // 5-day deadline
  if (status === 'overdue') {
    push('F-DEADLINE-OVERDUE-001', 'deadline', 'high',
      `The death must be registered within ${DEADLINE_DAYS} days of the medical examiner’s confirmation, and ${days} days have passed.`,
      'Tell the register office immediately and book the earliest appointment; weekends and bank holidays count towards the deadline.');
  } else if (status === 'due-soon') {
    push('F-DEADLINE-DUE-SOON-001', 'deadline', 'medium',
      `${days} of the ${DEADLINE_DAYS} days allowed since the medical examiner’s confirmation have passed.`,
      'Register now; if more time is needed tell the register office immediately.');
  } else if (status === 'registered-late') {
    push('F-DEADLINE-LATE-001', 'deadline', 'medium',
      `The death was registered ${days} days after the medical examiner’s confirmation, later than the ${DEADLINE_DAYS}-day limit.`,
      'No action on this registration; note the delay for the record.');
  }

  // Appointment and documents (LOW)
  if (!registered && !coronerPending(d) && d.registration.appointmentBooked !== 'yes') {
    push('F-APPOINTMENT-001', 'appointment', 'low',
      'No registration appointment is booked.',
      'Book an appointment with the register office for the district where the death occurred.');
  }
  if (!registered && d.registration.supportingDocumentsAvailable === 'no') {
    push('F-DOCUMENTS-001', 'documents', 'low',
      'Supporting documents are not to hand. They are helpful but not mandatory.',
      'Take what is available: the deceased’s birth or marriage certificate, passport, NHS medical card, driving licence, and proof of address.');
  }

  // Disposal certificate (MEDIUM / LOW)
  if (registered && d.aftercare.disposalCertificateIssued !== 'yes' && (d.aftercare.disposalMethod === 'burial' || d.aftercare.disposalMethod === 'cremation')) {
    push('F-DISPOSAL-CERTIFICATE-001', 'disposal-certificate', 'medium',
      'The certificate for burial or cremation (the green form) has not been issued, and the funeral cannot take place without it.',
      'Ask the registrar for the green form and give it to the funeral director, crematorium or burial authority.');
  }
  if (d.aftercare.disposalMethod === 'undecided') {
    push('F-DISPOSAL-UNDECIDED-001', 'disposal-certificate', 'low',
      'The method of disposal has not been decided.',
      'Decide between burial and cremation with the funeral director; cremation needs further forms.');
  }

  // Tell Us Once (LOW)
  if (registered && d.aftercare.tellUsOnceStatus !== 'reference-received' && d.aftercare.tellUsOnceStatus !== 'declined') {
    push('F-TELL-US-ONCE-001', 'tell-us-once', 'low',
      'No Tell Us Once reference number is recorded.',
      'Ask the registrar for the Tell Us Once reference number so government departments can be informed in one go.');
  }

  // Copies of the certificate (LOW)
  if (d.aftercare.copiesRequested === null || d.aftercare.copiesRequested === 0) {
    push('F-COPIES-001', 'copies', 'low',
      'No certified copies of the death certificate are planned. Banks, insurers and probate usually each need one.',
      'Decide how many copies are needed; copies are cheaper bought at registration than ordered later.');
  }
  if (d.aftercare.copyOrderChannel === 'gro-online' && !nonEmpty(d.aftercare.groIndexReference)) {
    push('F-GRO-INDEX-001', 'copies', 'low',
      'No GRO index reference is recorded: ordering online without it adds a search fee and takes about 15 working days.',
      'Find the GRO index reference (the register office can supply it) to avoid the extra fee.');
  }
  if (d.aftercare.priorityService === 'yes' && d.aftercare.copyOrderChannel !== 'gro-online') {
    push('F-PRIORITY-001', 'copies', 'low',
      'The priority (next working day) service is only available when ordering online from the General Register Office.',
      'Order online from the GRO, or drop the priority request.');
  }

  // Sort: high > medium > low (stable).
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return flags;
}

export { detectFlaggedIssues };
