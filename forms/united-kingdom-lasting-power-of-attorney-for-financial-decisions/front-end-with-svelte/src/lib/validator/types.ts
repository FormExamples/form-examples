// Re-export the validator-relevant types from $lib/types so that the
// engine has a single import surface.
export type {
  Lpa,
  Person,
  Address,
  Attorney,
  ReplacementAttorney,
  CertificateProvider,
  PersonToNotify,
  Signature,
  Witness,
  PreferencesAndInstructions,
  RegistrationApplication,
  RegistrationRecipient,
  ContinuationSheet,
  ValidationResult,
  FiredRule,
  AdditionalFlag,
  ValidityBand,
  CompositeRisk,
  RulePriority,
  FlagPriority,
} from '#lib/types.js';
