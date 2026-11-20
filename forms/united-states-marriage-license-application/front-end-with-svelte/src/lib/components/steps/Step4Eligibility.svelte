<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const v = assessment.data.eligibility;
</script>

<Fieldset legend="Step 4 of 6 — Eligibility">
  <p class="hint">
    Relationship, age and consent, appearance, proxy, and any premarital requirements.
  </p>

  <Field
    label="Relationship between the applicants"
    inputId="eligibility-relationshipBetweenApplicants"
  >
    <Select
      id="eligibility-relationshipBetweenApplicants"
      label="Relationship between the applicants"
      bind:value={v.relationshipBetweenApplicants}
    >
      <option value="">— Select —</option>
      <option value="not-related">Not related</option>
      <option value="related-prohibited">Related within a prohibited degree</option>
    </Select>
  </Field>
  <Field label="Consent for an applicant under 18" inputId="eligibility-minorConsent">
    <Select
      id="eligibility-minorConsent"
      label="Consent for an applicant under 18"
      bind:value={v.minorConsent}
    >
      <option value="">— Select —</option>
      <option value="not-applicable">Not applicable (both 18 or older)</option>
      <option value="parental-consent">Parental or guardian consent</option>
      <option value="court-order">Court order or judicial approval</option>
      <option value="none">No consent or court order</option>
    </Select>
  </Field>
  <Field
    label="Will both applicants appear in person before the clerk?"
    inputId="eligibility-appearInPerson"
  >
    <Select
      id="eligibility-appearInPerson"
      label="Will both applicants appear in person before the clerk?"
      bind:value={v.appearInPerson}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Is a proxy marriage requested?" inputId="eligibility-proxyRequested">
    <Select
      id="eligibility-proxyRequested"
      label="Is a proxy marriage requested?"
      bind:value={v.proxyRequested}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Is either applicant on active military duty?"
    inputId="eligibility-activeDutyMilitary"
  >
    <Select
      id="eligibility-activeDutyMilitary"
      label="Is either applicant on active military duty?"
      bind:value={v.activeDutyMilitary}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Completed a state-approved premarital course?"
    inputId="eligibility-premaritalCourseCompleted"
  >
    <Select
      id="eligibility-premaritalCourseCompleted"
      label="Completed a state-approved premarital course?"
      bind:value={v.premaritalCourseCompleted}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Premarital blood-test evidence" inputId="eligibility-bloodTestEvidence">
    <Select
      id="eligibility-bloodTestEvidence"
      label="Premarital blood-test evidence"
      bind:value={v.bloodTestEvidence}
    >
      <option value="">— Select —</option>
      <option value="provided">Test evidence provided</option>
      <option value="not-required">Not required</option>
      <option value="not-provided">Not provided</option>
    </Select>
  </Field>
</Fieldset>
