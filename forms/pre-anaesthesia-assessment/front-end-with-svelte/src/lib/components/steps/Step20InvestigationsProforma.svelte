<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';

  import { store } from '#lib/stores/assessment.svelte.js';

  const i = store.data.investigationsProforma;

  const textFields = [
    ['bloodGroupHaemoglobin', 'Blood group / haemoglobin'],
    ['differentialN', 'Differential — N'],
    ['differentialL', 'Differential — L'],
    ['differentialE', 'Differential — E'],
    ['differentialM', 'Differential — M'],
    ['differentialB', 'Differential — B'],
    ['absolute', 'Absolute'],
    ['nc', 'NC'],
    ['tlc', 'TLC'],
    ['tpc', 'TPC'],
    ['esr', 'ESR'],
    ['crp', 'CRP'],
    ['pcv', 'PCV'],
    ['latexRast', 'Latex-RAST'],
    ['fbs', 'FBS'],
    ['ppbs', 'PPBS'],
    ['hba1c', 'HbA1c'],
    ['na', 'Na'],
    ['k', 'K'],
    ['urea', 'Urea'],
    ['creatinine', 'Creatinine'],
    ['bilirubinTotal', 'Bilirubin total'],
    ['bilirubinDirect', 'Bilirubin direct'],
    ['alkPhosphatase', "Alk phosph'ase"],
    ['sgptAlt', 'SGPT-ALT'],
    ['sgotAst', 'SGOT-AST'],
    ['bt', 'BT'],
    ['ct', 'CT (clotting time)'],
    ['pt', 'PT'],
    ['aptt', 'aPTT'],
    ['inr', 'INR'],
    ['ft3', 'FT3'],
    ['ft4', 'FT4'],
    ['tsh', 'TSH'],
    ['ecg', 'ECG'],
    ['chestXray', 'Chest X-ray'],
    ['pft', 'PFT'],
    ['abg', 'ABG'],
    ['twoDEcho', '2D Echo'],
    ['tmt', 'TMT'],
    ['ctScan', 'CT (scan)'],
    ['mri', 'MRI'],
  ] as const;
</script>

<Fieldset legend="Step 20 — Investigations">
  <div class="field-grid field-grid-3">
    {#each textFields as [key, label]}
      <Field {label}>
        <TextInput {label} bind:value={i[key]} />
      </Field>
    {/each}
    <Field label="LVEF %">
      <NumberInput label="LVEF %" min={0} max={100} bind:value={i.lvefPercent} />
    </Field>
  </div>
</Fieldset>
