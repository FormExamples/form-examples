<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
</script>

<Fieldset legend="Step 8 — Renal and hepatic">
  <div class="field-grid field-grid-3">
    <Field label="Creatinine (umol/L)">
      <NumberInput label="Creatinine (umol/L)" bind:value={store.data.renalHepatic.creatinineUmolL} />
    </Field>
    <Field label="eGFR">
      <NumberInput label="eGFR" bind:value={store.data.renalHepatic.egfrMlMin173m2} />
    </Field>
    <Field label="CKD stage">
      <Select label="CKD stage" bind:value={store.data.renalHepatic.ckdStage}>
        <option value="">—</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3a">3a</option>
        <option value="3b">3b</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </Select>
    </Field>
    <Field label="Dialysis">
      <Select label="Dialysis" bind:value={store.data.renalHepatic.dialysisStatus}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="peritoneal">Peritoneal</option>
        <option value="haemodialysis">Haemodialysis</option>
        <option value="haemofiltration">Haemofiltration</option>
      </Select>
    </Field>
    <Field label="Bilirubin (umol/L)">
      <NumberInput label="Bilirubin (umol/L)" bind:value={store.data.renalHepatic.bilirubinUmolL} />
    </Field>
    <Field label="Albumin (g/L)">
      <NumberInput label="Albumin (g/L)" step="0.1" bind:value={store.data.renalHepatic.albuminGL} />
    </Field>
    <Field label="ALT (U/L)">
      <NumberInput label="ALT (U/L)" bind:value={store.data.renalHepatic.altUL} />
    </Field>
    <Field label="Liver disease">
      <Select label="Liver disease" bind:value={store.data.renalHepatic.chronicLiverDisease}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="compensated">Compensated</option>
        <option value="decompensated">Decompensated</option>
      </Select>
    </Field>
    <Field label="Child-Pugh">
      <Select label="Child-Pugh" bind:value={store.data.renalHepatic.childPughClass}>
        <option value="">—</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </Select>
    </Field>
    <Field label="Urinalysis findings" class="field-span-2">
      <TextInput label="Urinalysis findings" bind:value={store.data.renalHepatic.urinalysisFindings} />
    </Field>
  </div>
</Fieldset>
