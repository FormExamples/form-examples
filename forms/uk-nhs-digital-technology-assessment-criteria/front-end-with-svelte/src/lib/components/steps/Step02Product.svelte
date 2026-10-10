<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 2 — Product">
  <div class="field-grid">
    <Field label="Product name" inputId="step-2-product-name" error={store.errors['step-2-product-name']}>
      <TextInput
        id="step-2-product-name"
        label="Product name"
        bind:value={store.data.product.name}
        aria-invalid={store.errors['step-2-product-name'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Version">
      <TextInput label="Version" bind:value={store.data.product.version} />
    </Field>
    <Field label="Description" class="field-span-2">
      <TextAreaInput label="Description" rows={2} bind:value={store.data.product.description} />
    </Field>
    <Field label="Intended purpose" class="field-span-2">
      <TextAreaInput label="Intended purpose" rows={2} bind:value={store.data.product.intendedPurpose} />
    </Field>
    <Field label="Product type">
      <Select label="Product type" bind:value={store.data.product.productType}>
        <option value="">—</option>
        <option value="app">App</option>
        <option value="web-service">Web service</option>
        <option value="software-as-a-service">Software as a service</option>
        <option value="wearable-integrated">Wearable-integrated</option>
        <option value="clinical-decision-support">Clinical decision support</option>
        <option value="remote-monitoring">Remote monitoring</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Medical device class">
      <Select label="Medical device class" bind:value={store.data.product.medicalDeviceClass}>
        <option value="">—</option>
        <option value="not-a-medical-device">Not a medical device</option>
        <option value="class-i">Class I</option>
        <option value="class-iia">Class IIa</option>
        <option value="class-iib">Class IIb</option>
        <option value="class-iii">Class III</option>
        <option value="unknown">Unknown</option>
      </Select>
    </Field>
    <Field label="Handles patient data">
      <Select label="Handles patient data" bind:value={store.data.product.handlesPatientData}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Patient facing">
      <Select label="Patient facing" bind:value={store.data.product.isPatientFacing}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>
</Fieldset>
