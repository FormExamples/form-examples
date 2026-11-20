<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const s = assessment.data.titleHistory;
</script>

<Fieldset legend="Step 5 of 8 — Title history and brands">
  <p class="hint">
    The title document you hold, any brand on it (salvage, rebuilt, flood, and so on), and the
    NMVTIS vehicle-history check.
  </p>

  <Field label="Title document" inputId="titleHistory-titleDocument">
    <Select id="titleHistory-titleDocument" label="Title document" bind:value={s.titleDocument}>
      <option value="">— Select —</option>
      <option value="state-title">Certificate of title issued by this state</option>
      <option value="out-of-state-title">Certificate of title issued by another state</option>
      <option value="manufacturer-statement-of-origin">
        Manufacturer's statement of origin (new vehicle)
      </option>
      <option value="none">No title available</option>
    </Select>
  </Field>

  <Field
    label="Prior title surrendered with this application?"
    inputId="titleHistory-priorTitleSurrendered"
  >
    <Select
      id="titleHistory-priorTitleSurrendered"
      label="Prior title surrendered with this application?"
      bind:value={s.priorTitleSurrendered}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Title brand"
    inputId="titleHistory-titleBrand"
    description="A brand follows the vehicle to every state and must be carried onto the new title."
  >
    <Select id="titleHistory-titleBrand" label="Title brand" bind:value={s.titleBrand}>
      <option value="">— Select —</option>
      <option value="none">No brand</option>
      <option value="salvage">Salvage</option>
      <option value="junk">Junk</option>
      <option value="rebuilt">Rebuilt or reconstructed</option>
      <option value="flood">Flood</option>
      <option value="odometer-not-actual">Odometer: not actual mileage</option>
      <option value="lemon-law-buyback">Lemon-law buyback</option>
      <option value="hail">Hail damage</option>
      <option value="other">Other brand</option>
    </Select>
  </Field>

  <Field
    label="Brand disclosed on this application and to the buyer?"
    inputId="titleHistory-brandDisclosed"
  >
    <Select
      id="titleHistory-brandDisclosed"
      label="Brand disclosed on this application and to the buyer?"
      bind:value={s.brandDisclosed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="NMVTIS vehicle-history check"
    inputId="titleHistory-nmvtisCheck"
    description="The National Motor Vehicle Title Information System; the agency also queries it before issuing a title."
  >
    <Select
      id="titleHistory-nmvtisCheck"
      label="NMVTIS vehicle-history check"
      bind:value={s.nmvtisCheck}
    >
      <option value="">— Select —</option>
      <option value="clear">Checked: no brand, total-loss, or theft record</option>
      <option value="brand-or-theft-found">
        Checked: a brand, total-loss, or theft record was found
      </option>
      <option value="not-checked">Not checked</option>
    </Select>
  </Field>

  <Field label="Rebuilt-vehicle inspection" inputId="titleHistory-brandInspection">
    <Select
      id="titleHistory-brandInspection"
      label="Rebuilt-vehicle inspection"
      bind:value={s.brandInspection}
    >
      <option value="">— Select —</option>
      <option value="passed">Passed</option>
      <option value="not-done">Not done</option>
      <option value="not-applicable">Not applicable</option>
    </Select>
  </Field>
</Fieldset>
