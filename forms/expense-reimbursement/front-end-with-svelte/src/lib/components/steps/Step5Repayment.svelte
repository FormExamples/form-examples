<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import { claimStore } from '#lib/stores/result.svelte.js';
</script>

<Fieldset legend="5. Repayment">
  <p class="hint">How you would like to be repaid.</p>

  <Field label="Repayment method" inputId="repaymentMethod">
    <Select
      id="repaymentMethod"
      label="Repayment method"
      bind:value={claimStore.data.repayment.method}
    >
      <option value="">Select…</option>
      <option value="payroll">Add to my next payroll</option>
      <option value="bank-transfer">Bank transfer</option>
      <option value="cheque">Cheque</option>
      <option value="cash">Cash</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  {#if claimStore.data.repayment.method === 'bank-transfer'}
    <Field label="Account holder name" inputId="bankAccountName">
      <TextInput
        id="bankAccountName"
        label="Account holder name"
        bind:value={claimStore.data.repayment.bankAccountName}
      />
    </Field>

    <Field
      label="Last four digits of account number"
      inputId="bankAccountLastFour"
      description="Never enter your full account number here; finance will confirm the rest securely."
    >
      <TextInput
        id="bankAccountLastFour"
        label="Last four digits of account number"
        placeholder="1234"
        bind:value={claimStore.data.repayment.bankAccountLastFour}
      />
    </Field>
  {/if}
</Fieldset>
