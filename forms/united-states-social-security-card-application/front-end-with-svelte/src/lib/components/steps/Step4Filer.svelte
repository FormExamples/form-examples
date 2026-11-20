<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import { OPTIONS } from '#lib/engine/utils.js';

  const v = assessment.data.filer;
</script>

<Fieldset legend="Step 4 of 6 — Who is signing">
  <p class="hint">Items 18 and 19. A parent or legal guardian signs for an applicant under 18.</p>

  <Field
    label="Signer relationship to the person in item 1 (item 18)"
    inputId="filer-signerRelationship"
  >
    <Select
      id="filer-signerRelationship"
      label="Signer relationship to the person in item 1 (item 18)"
      bind:value={v.signerRelationship}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.signerRelationship as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field label="Signer name, if not the applicant" inputId="filer-signerName">
    <TextInput
      id="filer-signerName"
      label="Signer name, if not the applicant"
      placeholder=""
      bind:value={v.signerName}
    />
  </Field>
  <Field
    label="Has the signer, if not the applicant, brought their own proof of identity?"
    inputId="filer-signerIdentityDocument"
  >
    <Select
      id="filer-signerIdentityDocument"
      label="Has the signer, if not the applicant, brought their own proof of identity?"
      bind:value={v.signerIdentityDocument}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field label="Is the application signed? (item 19)" inputId="filer-signaturePresent">
    <Select
      id="filer-signaturePresent"
      label="Is the application signed? (item 19)"
      bind:value={v.signaturePresent}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
</Fieldset>
