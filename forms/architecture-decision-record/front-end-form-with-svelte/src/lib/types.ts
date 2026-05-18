export type Status = 'pending' | 'decided' | 'approved' | 'superseded' | 'deprecated';

export type DecisionGroup =
  | ''
  | 'business'
  | 'data'
  | 'integration'
  | 'presentation'
  | 'security'
  | 'infrastructure'
  | 'operations'
  | 'governance'
  | 'other';

export type AuthorRole =
  | ''
  | 'architect'
  | 'principal-engineer'
  | 'staff-engineer'
  | 'engineering-manager'
  | 'cto'
  | 'product-manager'
  | 'security-officer'
  | 'compliance-officer'
  | 'consultant'
  | 'other';

export interface Author {
  name: string;
  email: string;
  phone: string;
  role: AuthorRole;
  organizationName: string;
  teamName: string;
}

export interface Organization {
  name: string;
  legalName: string;
  industry: string;
  domain: string;
  countryAsIso31661Alpha2: string;
  description: string;
}

export interface Position {
  name: string;
  description: string;
  modelOrDiagramUrl: string;
  isChosen: boolean;
  pros: string;
  cons: string;
}

export interface Note {
  notedAt: string;
  notedBy: string;
  body: string;
}

export interface ArchitectureDecisionRecord {
  slug: string;
  number: string;
  title: string;
  decisionDate: string;
  status: Status;
  decisionGroup: DecisionGroup;
  issue: string;
  decision: string;
  assumptions: string;
  constraints: string;
  argument: string;
  implications: string;
  relatedDecisions: string;
  relatedRequirements: string;
  relatedArtifacts: string;
  relatedPrinciples: string;
  signedOffBy: string;
  signedOffAt: string;
}

export interface AdrFormData {
  author: Author;
  organization: Organization;
  adr: ArchitectureDecisionRecord;
  positions: Position[];
  notes: Note[];
}

export function emptyAdrFormData(): AdrFormData {
  return {
    author: { name: '', email: '', phone: '', role: '', organizationName: '', teamName: '' },
    organization: {
      name: '', legalName: '', industry: '', domain: '',
      countryAsIso31661Alpha2: '', description: ''
    },
    adr: {
      slug: '', number: '', title: '', decisionDate: '',
      status: 'pending', decisionGroup: '',
      issue: '', decision: '', assumptions: '', constraints: '',
      argument: '', implications: '',
      relatedDecisions: '', relatedRequirements: '',
      relatedArtifacts: '', relatedPrinciples: '',
      signedOffBy: '', signedOffAt: ''
    },
    positions: [
      { name: '', description: '', modelOrDiagramUrl: '', isChosen: false, pros: '', cons: '' }
    ],
    notes: []
  };
}
