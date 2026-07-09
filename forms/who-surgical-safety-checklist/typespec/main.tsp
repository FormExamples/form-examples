// Generated from sql/. Keep in sync by hand.
// SOURCE: forms/who-surgical-safety-checklist/sql/

import "@typespec/openapi3";

@doc("WHO Surgical Safety Checklist — TypeSpec models.")
namespace WhoSurgicalSafetyChecklist;

@doc("Patient receiving the surgical procedure.")
model Patient {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Patient full name as recorded on the consent form.")
  name: string;

  @doc("Date of birth.")
  birthDate?: plainDate;

  @doc("Recorded sex.")
  sex: "female" | "male" | "intersex" | "unknown" | "";

  @doc("United Kingdom NHS number, unique per person.")
  unitedKingdomNhsNumber?: string;

  @doc("Local medical record number (MRN) at the operating facility.")
  medicalRecordNumber?: string;

  @doc("Patient weight in kilograms; used for the paediatric 7 ml/kg blood-loss threshold.")
  weightAsKg?: float64;
}

@doc("Operating-room clinician who can fill in or sign off the WHO Surgical Safety Checklist.")
model Clinician {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Clinician full name.")
  name: string;

  @doc("Work email address.")
  email?: string;

  @doc("Work phone number.")
  phone?: string;

  @doc("Operating-room role.")
  role: "surgeon" | "assistant-surgeon" | "anaesthetist" | "circulating-nurse" | "scrub-nurse" | "anaesthetic-assistant" | "perfusionist" | "technician" | "other" | "";

  @doc("Professional registration body.")
  registrationBody: "GMC" | "NMC" | "HCPC" | "GPhC" | "other" | "";

  @doc("Registration number issued by the registration body.")
  registrationNumber: string;

  @doc("Local employee or smart-card number at the operating facility.")
  employeeNumber: string;

  @doc("United Kingdom NHS number, unique per person.")
  unitedKingdomNhsNumber?: string;
}

@doc("WHO Surgical Safety Checklist case record. One row per surgical case.")
model WhoSurgicalSafetyChecklist {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the patient receiving the procedure.")
  patientId: string;

  @doc("Foreign key to the lead surgeon for this case.")
  surgeonId?: string;

  @doc("Foreign key to the lead anaesthetist for this case.")
  anaesthetistId?: string;

  @doc("Foreign key to the lead (circulating) nurse for this case.")
  leadNurseId?: string;

  @doc("Overall checklist lifecycle status.")
  status: "not-started" | "sign-in-complete" | "time-out-complete" | "sign-out-complete" | "completed" | "abandoned";

  @doc("Operating facility or hospital site name.")
  siteName: string;

  @doc("Operating-room identifier (number, letter, or name).")
  operatingRoom: string;

  @doc("Date of the surgical procedure.")
  caseDate?: plainDate;

  @doc("Timestamp of wheels-in or induction.")
  caseStartAt?: utcDateTime;

  @doc("Timestamp of wheels-out from the operating room.")
  caseEndAt?: utcDateTime;

  @doc("Description of the planned surgical procedure.")
  plannedProcedure: string;

  @doc("Surgical specialty responsible for the procedure.")
  surgicalSpecialty: string;

  @doc("Procedure urgency (NCEPOD).")
  urgency: "elective" | "urgent" | "emergency" | "immediate" | "";

  @doc("Side of the body.")
  laterality: "left" | "right" | "bilateral" | "midline" | "na" | "";

  @doc("Whether the patient is paediatric (drives the 7 ml/kg blood-loss threshold).")
  isPaediatric: "yes" | "no" | "";

  @doc("Free-text reason when the case is abandoned before sign-out.")
  abandonedReason: string;

  @doc("Sign In #1: patient has confirmed identity, site, procedure, and consent.")
  signInIdentitySiteProcedureConsent: "yes" | "";

  @doc("Sign In #2: surgical site marked.")
  signInSiteMarked: "yes" | "not-applicable" | "";

  @doc("Sign In #3: anaesthesia machine and medication check complete.")
  signInAnaesthesiaCheckComplete: "yes" | "";

  @doc("Sign In #4: pulse oximeter on the patient and functioning.")
  signInPulseOximeterOnPatient: "yes" | "";

  @doc("Sign In #5: known allergy.")
  signInKnownAllergy: "no" | "yes" | "";

  @doc("Sign In #5: free-text description of known allergies.")
  signInKnownAllergyDetail: string;

  @doc("Sign In #6: difficult airway or aspiration risk.")
  signInDifficultAirwayAspirationRisk: "no" | "yes-equipment-available" | "";

  @doc("Sign In #7: risk of >500 ml (7 ml/kg in children) blood loss.")
  signInBloodLossRisk: "no" | "yes-two-ivs-and-fluids-planned" | "";

  @doc("Foreign key to the clinician who signed off the Sign In phase.")
  signInCoordinatorId?: string;

  @doc("Timestamp when Sign In phase was signed off.")
  signInCompletedAt?: utcDateTime;

  @doc("Time Out #1: all team members have introduced themselves by name and role.")
  timeOutTeamIntroductionsConfirmed: "yes" | "";

  @doc("Time Out #2: patient name, procedure, and incision site confirmed.")
  timeOutPatientProcedureIncisionConfirmed: "yes" | "";

  @doc("Time Out #3: antibiotic prophylaxis given within the last 60 minutes.")
  timeOutAntibioticProphylaxisWithin60min: "yes" | "not-applicable" | "";

  @doc("Time Out #4 (surgeon): critical or non-routine steps.")
  timeOutSurgeonCriticalSteps: string;

  @doc("Time Out #5 (surgeon): anticipated case duration in minutes.")
  timeOutSurgeonCaseDurationMinutes?: int32;

  @doc("Time Out #6 (surgeon): anticipated blood loss in millilitres.")
  timeOutSurgeonAnticipatedBloodLossMl?: int32;

  @doc("Time Out #7 (anaesthetist): patient-specific concerns.")
  timeOutAnaesthetistPatientConcerns: string;

  @doc("Time Out #8 (nursing): sterility (including indicator results) confirmed.")
  timeOutNursingSterilityConfirmed: "yes" | "";

  @doc("Time Out #9 (nursing): equipment issues or concerns.")
  timeOutNursingEquipmentConcerns: string;

  @doc("Time Out #10: essential imaging displayed.")
  timeOutEssentialImagingDisplayed: "yes" | "not-applicable" | "";

  @doc("Foreign key to the clinician who signed off the Time Out phase.")
  timeOutCoordinatorId?: string;

  @doc("Timestamp when Time Out phase was signed off.")
  timeOutCompletedAt?: utcDateTime;

  @doc("Sign Out #1: name of the procedure recorded confirmed by the nurse.")
  signOutProcedureNameConfirmed: "yes" | "";

  @doc("Sign Out #2: instrument, sponge, and needle counts confirmed.")
  signOutCountsConfirmed: "yes" | "no" | "";

  @doc("Sign Out #3: specimen labelling (read aloud, including patient name) confirmed.")
  signOutSpecimensLabelled: "yes" | "no" | "not-applicable" | "";

  @doc("Sign Out #4: equipment problems to be addressed.")
  signOutEquipmentProblems: string;

  @doc("Sign Out #5: key concerns for recovery and management of this patient.")
  signOutRecoveryConcerns: string;

  @doc("Foreign key to the clinician who signed off the Sign Out phase.")
  signOutCoordinatorId?: string;

  @doc("Timestamp when Sign Out phase was signed off.")
  signOutCompletedAt?: utcDateTime;
}

@doc("Operating-team roster row captured during the Time Out introductions step.")
model TeamMember {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent who_surgical_safety_checklist row.")
  checklistId: string;

  @doc("Optional foreign key to the clinician table for known staff.")
  clinicianId?: string;

  @doc("Team member name as introduced during the Time Out.")
  name: string;

  @doc("Operating-room role.")
  role: "surgeon" | "assistant-surgeon" | "anaesthetist" | "circulating-nurse" | "scrub-nurse" | "anaesthetic-assistant" | "perfusionist" | "technician" | "observer" | "other" | "";

  @doc("Whether this team member was introduced during the Time Out.")
  introducedDuringTimeOut: "yes" | "no" | "";

  @doc("Free-text notes (e.g., trainee, visiting consultant, observer institution).")
  notes: string;
}
