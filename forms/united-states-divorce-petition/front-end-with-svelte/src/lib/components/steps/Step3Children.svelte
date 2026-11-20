<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const c = assessment.data.children;
</script>

<Fieldset legend="Step 3 of 6 — Children and support">
  <p class="hint">
    Minor children, custody and parenting time, and the child-support guideline worksheet.
  </p>

  <Field label="Are there minor children of the marriage?" inputId="children-hasMinorChildren">
    <Select
      id="children-hasMinorChildren"
      label="Are there minor children of the marriage?"
      bind:value={c.hasMinorChildren}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Number of minor children" inputId="children-childrenCount">
    <NumberInput
      id="children-childrenCount"
      label="Number of minor children"
      min={0}
      max={30}
      bind:value={c.childrenCount}
    />
  </Field>

  <Field
    label="Months the children have lived in the filing state"
    inputId="children-childrenHomeStateMonths"
  >
    <NumberInput
      id="children-childrenHomeStateMonths"
      label="Months the children have lived in the filing state"
      min={0}
      max={1200}
      bind:value={c.childrenHomeStateMonths}
    />
  </Field>

  <Field
    label="Is either spouse pregnant with a child of the marriage?"
    inputId="children-pregnant"
  >
    <Select
      id="children-pregnant"
      label="Is either spouse pregnant with a child of the marriage?"
      bind:value={c.pregnant}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Custody and parenting-time plan documented?"
    inputId="children-custodyPlanDocumented"
  >
    <Select
      id="children-custodyPlanDocumented"
      label="Custody and parenting-time plan documented?"
      bind:value={c.custodyPlanDocumented}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="State child-support guideline worksheet completed?"
    inputId="children-childSupportWorksheetCompleted"
  >
    <Select
      id="children-childSupportWorksheetCompleted"
      label="State child-support guideline worksheet completed?"
      bind:value={c.childSupportWorksheetCompleted}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Monthly child support from the worksheet (US dollars)"
    inputId="children-childSupportMonthlyAmount"
  >
    <NumberInput
      id="children-childSupportMonthlyAmount"
      label="Monthly child support from the worksheet (US dollars)"
      min={0}
      max={1000000}
      bind:value={c.childSupportMonthlyAmount}
    />
  </Field>
</Fieldset>
