<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const i = assessment.data.informant;
</script>

<Fieldset legend="Step 4 of 5 — Informant, registration and identity">
  <p class="hint">Who registers, where and when, and the identity evidence they will bring.</p>

  <Field label="Informant (who is registering)" inputId="informant-informantRelationship">
    <Select
      id="informant-informantRelationship"
      label="Informant (who is registering)"
      bind:value={i.informantRelationship}
    >
      <option value="">— Select —</option>
      <option value="mother">Mother</option>
      <option value="father">Father</option>
      <option value="second-parent">Second parent (female parent)</option>
      <option value="both-parents">Both parents together</option>
      <option value="person-present-at-birth">Someone present at the birth</option>
      <option value="person-responsible-for-child">Someone responsible for the child</option>
      <option value="hospital-administrator">Hospital administrative staff</option>
      <option value="other">Other (for example a relative who was not present)</option>
    </Select>
  </Field>

  <Field label="Informant's full name" inputId="informant-informantName">
    <TextInput
      id="informant-informantName"
      label="Informant's full name"
      bind:value={i.informantName}
    />
  </Field>

  <Field
    label="If the informant is not a parent: are the parents unable to register?"
    inputId="informant-parentsUnableToRegister"
  >
    <Select
      id="informant-parentsUnableToRegister"
      label="If the informant is not a parent: are the parents unable to register?"
      bind:value={i.parentsUnableToRegister}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Where will the birth be registered?" inputId="informant-registrationRoute">
    <Select
      id="informant-registrationRoute"
      label="Where will the birth be registered?"
      bind:value={i.registrationRoute}
    >
      <option value="">— Select —</option>
      <option value="local-register-office">Local register office for the birth area</option>
      <option value="hospital">At the hospital before the mother leaves</option>
      <option value="other-register-office">Any other register office (details passed on)</option>
    </Select>
  </Field>

  <Field label="Registration date" inputId="informant-registrationDate">
    <DateInput
      id="informant-registrationDate"
      label="Registration date"
      bind:value={i.registrationDate}
    />
  </Field>

  <Field label="One accepted identity document" inputId="informant-identityPrimaryDocument">
    <Select
      id="informant-identityPrimaryDocument"
      label="One accepted identity document"
      bind:value={i.identityPrimaryDocument}
    >
      <option value="">— Select —</option>
      <option value="passport">Passport (valid or expired)</option>
      <option value="uk-photocard-driving-licence">UK photocard driving licence</option>
      <option value="eu-photocard-driving-licence">EU photocard driving licence (full)</option>
      <option value="uk-birth-or-adoption-certificate">UK birth or adoption certificate</option>
      <option value="biometric-immigration-document">UK biometric immigration document</option>
      <option value="uk-travel-document">UK travel document (leave to enter or remain)</option>
      <option value="refugee-or-stateless-travel-document"
        >Refugee or stateless person travel document</option
      >
      <option value="eu-identity-card">EU Member State identity card</option>
      <option value="proof-of-age-card">National Proof of Age Standards Scheme card</option>
      <option value="none">None of these</option>
    </Select>
  </Field>

  <Field label="Number of secondary documents" inputId="informant-identitySecondaryCount">
    <NumberInput
      id="informant-identitySecondaryCount"
      label="Number of secondary documents"
      min={0}
      max={10}
      bind:value={i.identitySecondaryCount}
    />
  </Field>

  <Field label="Are the documents originals?" inputId="informant-identityOriginals">
    <Select
      id="informant-identityOriginals"
      label="Are the documents originals?"
      bind:value={i.identityOriginals}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Will you bring the child's personal child health record (red book)?"
    inputId="informant-redBookPresented"
  >
    <Select
      id="informant-redBookPresented"
      label="Will you bring the child's personal child health record (red book)?"
      bind:value={i.redBookPresented}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
