// Provider Transfer Request - flagged-issue detection. Independent of the
// completeness check (handled by the validator), this module raises
// clinically significant flags for unstable patients, abnormal vital signs,
// emergent transfer urgency, infectious precautions, and several
// safety/safeguarding concerns. Priorities (urgent -> high -> medium -> low)
// drive sort order in the report.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

(function () {
'use strict';
window.ProviderTransferRequest = window.ProviderTransferRequest || {};
const { hasNumber, hasText } = window.ProviderTransferRequest;

/**
 * @param {AssessmentData} data
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const v = data.assessment.vitalSigns;
  const log = data.transferLogistics;

  // --- Emergent urgency (urgent) ------------------------------------
  if (data.situation.urgency === 'emergent') {
    flags.push({
      id: 'FLAG-URG-EMERG',
      category: 'Urgency',
      message:
        'Emergent transfer urgency - receiving team must accept and prepare immediately.',
      priority: 'urgent'
    });
  }

  // --- Patient not clinically stable (urgent) -----------------------
  if (data.assessment.clinicallyStable === 'no') {
    flags.push({
      id: 'FLAG-STAB-NO',
      category: 'Clinical stability',
      message:
        'Patient flagged as not clinically stable for transfer - escalate before departure.',
      priority: 'urgent'
    });
  }

  // --- Conscious level depressed (urgent) ---------------------------
  if (data.assessment.consciousLevel === 'unresponsive') {
    flags.push({
      id: 'FLAG-LOC-UNRESP',
      category: 'Conscious level',
      message:
        'Patient unresponsive - airway protection and critical-care escort likely required.',
      priority: 'urgent'
    });
  }

  // --- Vital signs: airway/breathing/oxygenation (urgent) ----------
  if (hasNumber(v.oxygenSaturation) && v.oxygenSaturation < 90) {
    flags.push({
      id: 'FLAG-VIT-SPO2',
      category: 'Vital signs',
      message: `Oxygen saturation ${v.oxygenSaturation}% is critically low (< 90%).`,
      priority: 'urgent'
    });
  }

  if (hasNumber(v.respiratoryRate)) {
    const rr = v.respiratoryRate;
    if (rr < 8 || rr > 30) {
      flags.push({
        id: 'FLAG-VIT-RR',
        category: 'Vital signs',
        message: `Respiratory rate ${rr}/min is outside the safe range (8-30).`,
        priority: 'urgent'
      });
    }
  }

  // --- Vital signs: NEWS2 elevated (urgent / high) ------------------
  if (hasNumber(v.newsScore)) {
    if (v.newsScore >= 7) {
      flags.push({
        id: 'FLAG-VIT-NEWS-HIGH',
        category: 'Vital signs',
        message: `NEWS2 ${v.newsScore} indicates high clinical risk - urgent review required.`,
        priority: 'urgent'
      });
    } else if (v.newsScore >= 5) {
      flags.push({
        id: 'FLAG-VIT-NEWS-MED',
        category: 'Vital signs',
        message: `NEWS2 ${v.newsScore} indicates medium clinical risk - increased monitoring.`,
        priority: 'high'
      });
    }
  }

  // --- Vital signs: circulation / perfusion (high) -----------------
  if (hasNumber(v.systolicBloodPressure)) {
    const sbp = v.systolicBloodPressure;
    if (sbp < 90) {
      flags.push({
        id: 'FLAG-VIT-SBP-LOW',
        category: 'Vital signs',
        message: `Systolic blood pressure ${sbp} mmHg suggests hypotension/shock (< 90).`,
        priority: 'high'
      });
    } else if (sbp > 180) {
      flags.push({
        id: 'FLAG-VIT-SBP-HIGH',
        category: 'Vital signs',
        message: `Systolic blood pressure ${sbp} mmHg is severely elevated (> 180).`,
        priority: 'high'
      });
    }
  }

  if (hasNumber(v.heartRate)) {
    const hr = v.heartRate;
    if (hr < 50 || hr > 130) {
      flags.push({
        id: 'FLAG-VIT-HR',
        category: 'Vital signs',
        message: `Heart rate ${hr}/min is outside the safe range (50-130).`,
        priority: 'high'
      });
    }
  }

  if (hasNumber(v.temperatureCelsius)) {
    const t = v.temperatureCelsius;
    if (t < 35 || t >= 39) {
      flags.push({
        id: 'FLAG-VIT-TEMP',
        category: 'Vital signs',
        message:
          `Temperature ${t} C is outside the safe range (hypothermia < 35 C, hyperpyrexia >= 39 C).`,
        priority: 'high'
      });
    }
  }

  // --- Conscious level drowsy (high) --------------------------------
  if (data.assessment.consciousLevel === 'drowsy') {
    flags.push({
      id: 'FLAG-LOC-DROWSY',
      category: 'Conscious level',
      message:
        'Patient drowsy - re-assess airway risk and confirm appropriate escort.',
      priority: 'high'
    });
  }

  // --- Infectious precautions (high) --------------------------------
  if (log.infectiousPrecautions) {
    flags.push({
      id: 'FLAG-INF-PRC',
      category: 'Infection control',
      message:
        `Infectious precautions flagged: ${
          hasText(log.infectiousPrecautionsDetails)
            ? log.infectiousPrecautionsDetails.trim()
            : 'details not specified'
        }. Receiving area must prepare isolation and PPE.`,
      priority: 'high'
    });
  }

  // --- Cardiac monitoring required (high) ---------------------------
  if (log.cardiacMonitoringRequired) {
    flags.push({
      id: 'FLAG-LOG-CARDIAC',
      category: 'Transport requirement',
      message:
        'Cardiac monitoring required during transfer - confirm telemetry-capable transport.',
      priority: 'high'
    });
  }

  // --- Mental capacity concerns (high) ------------------------------
  if (log.mentalCapacityConcerns) {
    flags.push({
      id: 'FLAG-MCA',
      category: 'Safeguarding',
      message:
        'Mental Capacity Act concerns flagged - ensure best-interests/DoLS documentation accompanies transfer.',
      priority: 'high'
    });
  }

  // --- Urgent transfer urgency (high) -------------------------------
  if (data.situation.urgency === 'urgent') {
    flags.push({
      id: 'FLAG-URG-URGENT',
      category: 'Urgency',
      message: 'Urgent transfer - receiving team should be expecting the patient promptly.',
      priority: 'high'
    });
  }

  // --- Oxygen required (medium) -------------------------------------
  if (log.oxygenRequired) {
    flags.push({
      id: 'FLAG-LOG-O2',
      category: 'Transport requirement',
      message:
        'Supplemental oxygen required during transfer - confirm cylinder volume covers journey.',
      priority: 'medium'
    });
  }

  // --- Escort required (medium) -------------------------------------
  if (log.escortRequired) {
    flags.push({
      id: 'FLAG-LOG-ESCORT',
      category: 'Transport requirement',
      message:
        `Clinical escort required: ${
          hasText(log.escortDetails) ? log.escortDetails.trim() : 'details not specified'
        }.`,
      priority: 'medium'
    });
  }

  // --- Falls risk (medium) ------------------------------------------
  if (log.fallsRisk) {
    flags.push({
      id: 'FLAG-LOG-FALLS',
      category: 'Transport requirement',
      message:
        'Falls risk flagged - ensure stretcher straps and bed-rails on arrival.',
      priority: 'medium'
    });
  }

  // --- Acknowledgement still pending (low) --------------------------
  if (
    !data.signoffAcknowledgement.acknowledgementReceived &&
    hasText(data.signoffAcknowledgement.requestingProviderSignature)
  ) {
    flags.push({
      id: 'FLAG-ACK-PENDING',
      category: 'Acknowledgement',
      message:
        'Receiving-provider acknowledgement not yet recorded - chase confirmation before departure.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.ProviderTransferRequest.detectFlaggedIssues = detectFlaggedIssues;
})();
