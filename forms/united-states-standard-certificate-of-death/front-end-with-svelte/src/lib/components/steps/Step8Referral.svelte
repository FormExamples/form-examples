<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const referral = assessment.data.referral;
</script>

<Fieldset legend="Step 8 of 11 — Medical examiner or coroner referral">
  <p class="hint">
    Whether the death has been referred to the medical examiner or coroner and why. Any listed
    circumstance makes the certificate a referral case.
  </p>

  <Field
    label="Referred to the medical examiner or coroner?"
    inputId="referral-referredToMedicalExaminer"
  >
    <Select
      id="referral-referredToMedicalExaminer"
      label="Referred to the medical examiner or coroner?"
      bind:value={referral.referredToMedicalExaminer}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Referral reason" inputId="referral-referralReason">
    <Select
      id="referral-referralReason"
      label="Referral reason"
      bind:value={referral.referralReason}
    >
      <option value="">— Select —</option>
      <option value="none">None: no referral criterion met</option>
      <option value="violent-or-unnatural">Violent or unnatural death</option>
      <option value="accident">Accident or injury</option>
      <option value="suicide">Suicide</option>
      <option value="homicide">Homicide</option>
      <option value="suspicious">Suspicious circumstances</option>
      <option value="poisoning-or-overdose">Poisoning or drug overdose</option>
      <option value="unattended-by-physician">Unattended by a physician</option>
      <option value="sudden-unexpected-infant-death">Sudden unexpected infant death</option>
      <option value="work-related">Work-related death</option>
      <option value="medical-procedure-related">Related to a medical or surgical procedure</option>
      <option value="in-custody">Death in custody or police action</option>
      <option value="public-health-hazard">Public-health hazard</option>
      <option value="unidentified">Unidentified body</option>
      <option value="other">Other reportable circumstance</option>
    </Select>
  </Field>

  <Field label="Certifier note" inputId="referral-certifierNote">
    <TextAreaInput
      id="referral-certifierNote"
      label="Certifier note"
      rows={3}
      placeholder="Free-text note from the certifier or funeral director."
      bind:value={referral.certifierNote}
    />
  </Field>
</Fieldset>
