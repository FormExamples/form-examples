<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const e = assessment.data.execution;
</script>

<Fieldset legend="Step 5 of 6 — Signing: notary and witnesses">
  <p class="hint">How the principal’s signature will be formalized.</p>

  <Field label="Notary acknowledgment arranged?" inputId="execution-notaryArranged">
    <Select
      id="execution-notaryArranged"
      label="Notary acknowledgment arranged?"
      bind:value={e.notaryArranged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Number of witnesses arranged (not counting the notary)"
    inputId="execution-witnessCount"
  >
    <NumberInput
      id="execution-witnessCount"
      label="Number of witnesses arranged (not counting the notary)"
      min={0}
      bind:value={e.witnessCount}
    />
  </Field>
  <Field label="Is any witness an agent or successor agent?" inputId="execution-witnessIsAgent">
    <Select
      id="execution-witnessIsAgent"
      label="Is any witness an agent or successor agent?"
      bind:value={e.witnessIsAgent}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
