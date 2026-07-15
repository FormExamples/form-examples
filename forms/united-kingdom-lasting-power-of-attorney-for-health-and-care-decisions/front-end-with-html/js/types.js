// JSDoc type aliases mirroring the SvelteKit engine's `types.ts`. Other
// engine modules reference these types via @typedef imports.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'england' | 'wales' | ''} Jurisdiction
 * @typedef {'en' | 'cy' | ''} PreferredLanguage
 * @typedef {'spouse'|'civil-partner'|'child'|'parent'|'sibling'|'friend'|'professional'|'other'|''} Relationship
 * @typedef {'skill-based' | 'knowledge-based' | ''} CertificateProviderRoute
 * @typedef {'solicitor'|'barrister'|'general-practitioner'|'consultant'|'registered-nurse'|'registered-social-worker'|'imca'|'psychiatrist'|'psychologist'|'other-registered-professional'|''} CertificateProviderProfession
 * @typedef {'jointly' | 'jointly-and-severally' | 'mixed' | ''} DecisionRule
 * @typedef {'option-a' | 'option-b' | ''} LstChoice
 * @typedef {'donor'|'certificate-provider'|'attorney'|'replacement-attorney'|''} SignerRole
 * @typedef {'wet-ink'|'electronic'|'mark-with-witness'|''} SignatureMethod
 * @typedef {'donor'|'attorney'|'attorneys-jointly'|''} ApplicantRole
 * @typedef {'none'|'half'|'full-exempt'|''} FeeRemission
 * @typedef {'post'|'opg-digital'|'solicitor-portal'|''} SubmissionChannel
 * @typedef {'fatal' | 'high' | 'medium' | 'informational'} RuleSeverity
 * @typedef {'donor'|'attorney'|'certificate-provider'|'signature-order'|'instruction'|'registration'|''} RuleFamily
 * @typedef {'low' | 'medium' | 'high' | ''} FlagPriority
 * @typedef {'ready-to-register' | 'needs-correction' | 'invalid' | ''} ValidityStatus
 *
 * @typedef {Object} Donor
 * @property {string} title
 * @property {string} givenNames
 * @property {string} familyName
 * @property {string} otherNamesUsed
 * @property {string} birthDate
 * @property {string} email
 * @property {string} phone
 * @property {string} postalAddressAsFullText
 * @property {string} countryAsIso31661Alpha2
 * @property {string} postcode
 * @property {string} unitedKingdomNhsNumber
 * @property {Jurisdiction} jurisdiction
 * @property {PreferredLanguage} preferredLanguage
 * @property {YesNo} capacityDeclared
 * @property {string} capacityDeclaredAt
 *
 * @typedef {Object} Attorney
 * @property {string} title
 * @property {string} givenNames
 * @property {string} familyName
 * @property {string} birthDate
 * @property {string} email
 * @property {string} phone
 * @property {string} postalAddressAsFullText
 * @property {string} countryAsIso31661Alpha2
 * @property {string} postcode
 * @property {Relationship} relationshipToDonor
 * @property {YesNo} isBankrupt
 * @property {YesNo} capacityDeclared
 *
 * @typedef {Attorney & { replacementTrigger: string }} ReplacementAttorney
 *
 * @typedef {Object} CertificateProvider
 * @property {string} title
 * @property {string} givenNames
 * @property {string} familyName
 * @property {string} email
 * @property {string} phone
 * @property {string} postalAddressAsFullText
 * @property {string} countryAsIso31661Alpha2
 * @property {string} postcode
 * @property {CertificateProviderRoute} route
 * @property {CertificateProviderProfession} profession
 * @property {string} professionRegistrationNumber
 * @property {number | null} yearsKnownDonor
 * @property {string} relationshipToDonor
 * @property {YesNo} declaredNotFamily
 * @property {YesNo} declaredNotEmployee
 * @property {YesNo} declaredNotAttorney
 *
 * @typedef {Object} PersonToNotify
 * @property {string} title
 * @property {string} givenNames
 * @property {string} familyName
 * @property {string} email
 * @property {string} phone
 * @property {string} postalAddressAsFullText
 * @property {string} countryAsIso31661Alpha2
 * @property {string} postcode
 * @property {Relationship} relationshipToDonor
 *
 * @typedef {Object} Preference
 * @property {string} category
 * @property {string} statement
 *
 * @typedef {Object} Instruction
 * @property {string} category
 * @property {string} statement
 * @property {YesNo} lawfulnessAssessed
 * @property {YesNo} contradictsAdrt
 *
 * @typedef {Object} Signature
 * @property {SignerRole} signerRole
 * @property {number} signerIndex
 * @property {string} signedAt
 * @property {SignatureMethod} signatureMethod
 * @property {string} witnessName
 * @property {string} witnessAddress
 * @property {string} witnessSignedAt
 * @property {YesNo} witnessIsAttorney
 *
 * @typedef {Object} RegistrationApplication
 * @property {ApplicantRole} applicantRole
 * @property {string} applicantSignedAt
 * @property {number} feeAmountPounds
 * @property {FeeRemission} feeRemission
 * @property {string} feeRemissionReason
 * @property {string} submittedAt
 * @property {SubmissionChannel} submissionChannel
 *
 * @typedef {Object} LpaApplication
 * @property {string} formVersion
 * @property {Jurisdiction} jurisdiction
 * @property {Donor} donor
 * @property {Attorney[]} attorneys
 * @property {ReplacementAttorney[]} replacementAttorneys
 * @property {CertificateProvider | null} certificateProvider
 * @property {PersonToNotify[]} peopleToNotify
 * @property {DecisionRule} decisionRule
 * @property {string} jointDecisionSet
 * @property {LstChoice} lstChoice
 * @property {YesNo} lstDonorInitialled
 * @property {Preference[]} preferences
 * @property {Instruction[]} instructions
 * @property {Signature[]} signatures
 * @property {RegistrationApplication} registration
 *
 * @typedef {Object} FiredRule
 * @property {string} ruleId
 * @property {RuleSeverity} severity
 * @property {RuleFamily} ruleFamily
 * @property {string} sourceCitation
 * @property {string} description
 * @property {string} suggestedCorrection
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} flagId
 * @property {string} category
 * @property {FlagPriority} priority
 * @property {string} description
 * @property {string} suggestedAction
 *
 * @typedef {Object} LpaValidityResult
 * @property {ValidityStatus} validityStatus
 * @property {number} completenessScore
 * @property {string | null} effectiveDate
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} engineVersion
 * @property {string} computedAt
 */

export const ENGINE_VERSION = '0.1.0';
