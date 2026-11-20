<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.filing;
</script>

<Fieldset legend="Step 1 of 6 — Filing and grounds">
  <p class="hint">Where the petition is filed, whether it is agreed, and the ground pleaded.</p>

  <Field label="Filing state" inputId="filing-state">
    <TextInput id="filing-state" label="Filing state" bind:value={p.state} />
  </Field>

  <Field label="County of the filing court" inputId="filing-county">
    <TextInput id="filing-county" label="County of the filing court" bind:value={p.county} />
  </Field>

  <Field label="Filing date" inputId="filing-filingDate">
    <DateInput id="filing-filingDate" label="Filing date" bind:value={p.filingDate} />
  </Field>

  <Field label="Uncontested or contested?" inputId="filing-caseType">
    <Select id="filing-caseType" label="Uncontested or contested?" bind:value={p.caseType}>
      <option value="">— Select —</option>
      <option value="uncontested">Uncontested (agreed)</option>
      <option value="contested">Contested</option>
    </Select>
  </Field>

  <Field label="Ground pleaded" inputId="filing-groundType">
    <Select id="filing-groundType" label="Ground pleaded" bind:value={p.groundType}>
      <option value="">— Select —</option>
      <option value="no-fault">
        No-fault (irretrievable breakdown, irreconcilable differences)
      </option>
      <option value="fault">Fault ground</option>
    </Select>
  </Field>

  <Field label="Fault ground (if fault)" inputId="filing-faultGround">
    <Select id="filing-faultGround" label="Fault ground (if fault)" bind:value={p.faultGround}>
      <option value="">— Select —</option>
      <option value="adultery">Adultery</option>
      <option value="cruelty">Cruelty</option>
      <option value="abandonment">Abandonment or desertion</option>
      <option value="felony-conviction">Felony conviction or imprisonment</option>
      <option value="impotence">Impotence</option>
      <option value="other">Other fault ground</option>
    </Select>
  </Field>
</Fieldset>
