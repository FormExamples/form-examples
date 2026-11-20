<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { OPTIONS } from '#lib/engine/utils.js';

  const v = assessment.data.evidence;
</script>

<Fieldset legend="Step 3 of 6 — Evidence documents">
  <p class="hint">
    Proof of identity, age, and US citizenship or lawful alien status. SSA accepts only original
    documents or copies certified by the issuing agency.
  </p>

  <Field label="Proof of identity" inputId="evidence-identityDocument">
    <Select
      id="evidence-identityDocument"
      label="Proof of identity"
      bind:value={v.identityDocument}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.identityDocument as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">
    Must be current and unexpired, and show your name, identifying information, and preferably a
    photograph.
  </p>
  <Field label="Is the identity document expired?" inputId="evidence-identityDocumentExpired">
    <Select
      id="evidence-identityDocumentExpired"
      label="Is the identity document expired?"
      bind:value={v.identityDocumentExpired}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field label="Proof of age" inputId="evidence-ageDocument">
    <Select id="evidence-ageDocument" label="Proof of age" bind:value={v.ageDocument}>
      <option value="">— Select —</option>
      {#each OPTIONS.ageDocument as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">
    Required for an original card and for a date-of-birth correction. A birth certificate is
    preferred.
  </p>
  <Field
    label="Proof of US citizenship or lawful alien status"
    inputId="evidence-citizenshipDocument"
  >
    <Select
      id="evidence-citizenshipDocument"
      label="Proof of US citizenship or lawful alien status"
      bind:value={v.citizenshipDocument}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.citizenshipDocument as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field
    label="Does SSA already hold your citizenship or status evidence?"
    inputId="evidence-citizenshipOnFile"
  >
    <Select
      id="evidence-citizenshipOnFile"
      label="Does SSA already hold your citizenship or status evidence?"
      bind:value={v.citizenshipOnFile}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNoUnknown as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">For a replacement card, evidence already on file need not be shown again.</p>
  <Field label="Legal name-change document" inputId="evidence-nameChangeDocument">
    <Select
      id="evidence-nameChangeDocument"
      label="Legal name-change document"
      bind:value={v.nameChangeDocument}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.nameChangeDocument as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field
    label="Is every document an original or an agency-certified copy?"
    inputId="evidence-documentsOriginalOrCertified"
  >
    <Select
      id="evidence-documentsOriginalOrCertified"
      label="Is every document an original or an agency-certified copy?"
      bind:value={v.documentsOriginalOrCertified}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">Photocopies and notarized copies are not accepted.</p>
</Fieldset>
