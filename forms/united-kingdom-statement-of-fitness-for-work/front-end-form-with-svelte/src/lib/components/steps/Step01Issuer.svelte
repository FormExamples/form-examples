<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import YesNoToggle from '$lib/components/ui/YesNoToggle.svelte';
  import { store } from '$lib/store.svelte.js';
  import {
    PRACTICE_SETTINGS,
    PROFESSIONS,
    REGISTRATION_BODIES,
  } from '$lib/types.js';

  const c = $derived(store.data.clinician);
  const mp = $derived(store.data.medicalPractice);
</script>

<section aria-labelledby="step1-heading">
  <h2 id="step1-heading" class="text-xl font-semibold mb-4">Step 1 — Issuer identification</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field id="clinician-name" label="Clinician name" required>
      <input
        id="clinician-name"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.clinician.name}
      />
    </Field>
    <Field id="clinician-profession" label="Profession" required>
      <select
        id="clinician-profession"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.clinician.profession}
      >
        <option value="">—</option>
        {#each PROFESSIONS as p (p.value)}
          <option value={p.value}>{p.label}</option>
        {/each}
      </select>
    </Field>
    <Field id="clinician-registration-body" label="Registration body">
      <select
        id="clinician-registration-body"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.clinician.registrationBody}
      >
        <option value="">—</option>
        {#each REGISTRATION_BODIES as r (r.value)}
          <option value={r.value}>{r.label}</option>
        {/each}
      </select>
    </Field>
    <Field id="clinician-registration-number" label="Registration number">
      <input
        id="clinician-registration-number"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.clinician.registrationNumber}
      />
    </Field>
    <Field id="clinician-private" label="Private practice?">
      <YesNoToggle
        id="clinician-private"
        name="isPrivatePractice"
        bind:value={store.data.clinician.isPrivatePractice}
      />
    </Field>
    <div></div>
    <Field id="practice-name" label="Medical practice name">
      <input
        id="practice-name"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.medicalPractice.name}
      />
    </Field>
    <Field id="practice-postcode" label="Postcode">
      <input
        id="practice-postcode"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.medicalPractice.postcode}
      />
    </Field>
    <Field id="practice-address" label="Practice address" required hint="Postal address as a single free-text block.">
      <textarea
        id="practice-address"
        rows={3}
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.medicalPractice.postalAddressAsFullText}
      ></textarea>
    </Field>
    <Field id="practice-setting" label="Practice setting">
      <select
        id="practice-setting"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.medicalPractice.setting}
      >
        <option value="">—</option>
        {#each PRACTICE_SETTINGS as s (s.value)}
          <option value={s.value}>{s.label}</option>
        {/each}
      </select>
    </Field>
    <Field id="practice-ods" label="ODS code (optional)" hint="NHS Organisation Data Service code.">
      <input
        id="practice-ods"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.medicalPractice.odsCode}
      />
    </Field>
  </div>
</section>
