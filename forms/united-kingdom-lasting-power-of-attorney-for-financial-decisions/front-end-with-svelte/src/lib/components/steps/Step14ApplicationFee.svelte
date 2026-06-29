<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import CheckboxField from '$lib/components/ui/CheckboxField.svelte';

  const app = $derived(store.data.registrationApplication);

  const paymentOptions = [
    { value: 'card', label: 'Pay by debit or credit card (the OPG will phone for details)' },
    { value: 'cheque', label: 'Pay by cheque (make payable to "Office of the Public Guardian")' },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 14 &mdash; Application fee (LP1F section 14)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    The standard LPA registration fee is &pound;82. If the donor is on a low income or
    means-tested benefits, a reduction or exemption may apply (use LPA120A).
  </p>

  <RadioGroup name="paymentMethod" options={paymentOptions} bind:value={app.paymentMethod} />

  {#if app.paymentMethod === 'card'}
    <div class="mt-3">
      <Field label="Phone number for card payment" hint="The OPG will call this number to take card details.">
        <TextInput type="tel" bind:value={app.cardPaymentPhone} />
      </Field>
    </div>
  {/if}

  <div class="mt-4 space-y-2">
    <CheckboxField
      label="Apply for a reduced or no fee (requires LPA120A evidence)"
      bind:checked={app.reducedFeeRequested}
    />
    {#if app.reducedFeeRequested}
      <p class="text-xs text-base-content/60 ml-6">
        Download form LPA120A from the OPG and attach evidence of low income or benefits.
      </p>
      <div class="ml-6">
        <CheckboxField
          label="LPA120A evidence is attached"
          bind:checked={app.hasLpa120aEvidence}
        />
      </div>
    {/if}

    <CheckboxField
      label="This is a repeat application after a previous LPA was rejected"
      bind:checked={app.isRepeatApplication}
    />
    {#if app.isRepeatApplication}
      <div class="ml-6">
        <Field label="Previous OPG case number">
          <TextInput bind:value={app.repeatCaseNumber} />
        </Field>
      </div>
    {/if}
  </div>
</section>
