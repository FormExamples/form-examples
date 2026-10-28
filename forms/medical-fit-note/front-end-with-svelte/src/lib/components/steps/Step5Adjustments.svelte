<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import YesCheckbox from './YesCheckbox.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
</script>

<Fieldset legend="Step 5 of 8 — Adjustments" id="step-5-legend">
  <p class="hint">
    Required when the employee may be fit for work: select at least one (rule R-05).
  </p>
  <YesCheckbox
    id="step-5-phased-return"
    label="Phased return to work"
    bind:value={store.data.adjustmentPhasedReturn}
  />
  <YesCheckbox
    id="step-5-altered-hours"
    label="Altered hours"
    bind:value={store.data.adjustmentAlteredHours}
  />
  <YesCheckbox
    id="step-5-amended-duties"
    label="Amended duties"
    bind:value={store.data.adjustmentAmendedDuties}
  />
  <YesCheckbox
    id="step-5-workplace-adaptations"
    label="Workplace adaptations"
    bind:value={store.data.adjustmentWorkplaceAdaptations}
  />
  <Field label="Comments" inputId="step-5-comments">
    <TextAreaInput
      id="step-5-comments"
      label="Comments"
      rows={3}
      bind:value={store.data.comments}
    />
  </Field>
</Fieldset>
