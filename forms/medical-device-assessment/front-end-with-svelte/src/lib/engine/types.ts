import type { createDefaultAssessment, createEngineDefaults } from './defaults';

/** The wizard state, derived from the defaults so the two can never drift. */
export type AssessmentData = ReturnType<typeof createDefaultAssessment>;

/** The subset of the state the engine reads. */
export type EngineInput = ReturnType<typeof createEngineDefaults>;

export type DeviceClass = 'I' | 'IIa' | 'IIb' | 'III' | '';
export type ConformityRoute =
  'self-declaration' | 'notified-body-partial' | 'notified-body-full' | '';
export type Readiness = 'ready' | 'gaps' | 'blocked';
export type FlagPriority = 'high' | 'medium' | 'low';

export interface FiredRule {
  ruleId: string;
  annexViiiRule: number;
  deviceClass: Exclude<DeviceClass, ''>;
  category: string;
  description: string;
}

export interface AdditionalFlag {
  flagId: string;
  category: string;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

export interface GradingResult {
  computedDeviceClass: DeviceClass;
  finalDeviceClass: DeviceClass;
  classSuffix: string;
  overrideReason: string;
  conformityRoute: ConformityRoute;
  determiningRule: string;
  regulatoryReadiness: Readiness;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}

/** One dashboard row (ported from js/dashboard-types.js). */
export interface DashboardRow {
  id: string;
  date: string;
  device: string;
  deviceKind: string;
  computedClass: DeviceClass;
  finalClass: DeviceClass;
  classSuffix: string;
  conformityRoute: ConformityRoute;
  determiningRule: string;
  readiness: Readiness;
  flags: string[];
  summary: string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  /** Dotted path into the state object. */
  path: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'yn';
  options?: FieldOption[];
  hint?: string;
  required?: boolean;
  /** Label for the blank option; null removes the blank option. */
  blankLabel?: string | null;
  /** Whether the question applies to the current answers. */
  show?: (state: AssessmentData, live: GradingResult) => boolean;
}

export interface StepDef {
  step: number;
  title: string;
  short: string;
  description: string;
  fields: FieldDef[];
}
