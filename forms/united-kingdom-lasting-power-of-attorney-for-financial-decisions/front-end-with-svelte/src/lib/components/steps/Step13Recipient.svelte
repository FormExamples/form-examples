<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import CheckboxField from '$lib/components/ui/CheckboxField.svelte';

  const recipient = $derived(store.data.registrationRecipient);

  const recipientOptions = [
    { value: 'donor', label: 'Send to the donor' },
    { value: 'attorney', label: 'Send to one of the attorneys' },
    { value: 'other', label: 'Send to someone else (e.g. solicitor)' },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 13 &mdash; Who receives the LPA (LP1F section 13)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    Choose who the OPG should send the registered LPA to, and how they would like to be
    contacted about the application.
  </p>

  <RadioGroup
    name="recipientKind"
    options={recipientOptions}
    bind:value={recipient.recipientKind}
  />

  {#if recipient.recipientKind === 'other'}
    <div class="mt-4 space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Recipient first names">
          <TextInput bind:value={recipient.otherFirstNames} />
        </Field>
        <Field label="Recipient last name">
          <TextInput bind:value={recipient.otherLastName} />
        </Field>
      </div>
      <Field label="Company / firm (optional)">
        <TextInput bind:value={recipient.companyName} />
      </Field>
      <Field label="Address line 1">
        <TextInput bind:value={recipient.otherAddressLine1} />
      </Field>
      <Field label="Address line 2">
        <TextInput bind:value={recipient.otherAddressLine2} />
      </Field>
      <Field label="Address line 3">
        <TextInput bind:value={recipient.otherAddressLine3} />
      </Field>
      <Field label="Postcode">
        <TextInput bind:value={recipient.otherPostcode} />
      </Field>
    </div>
  {/if}

  <div class="mt-4 space-y-3">
    <h3 class="text-sm font-semibold text-base-content/80">Contact preferences</h3>
    <CheckboxField label="Prefer to be contacted by post" bind:checked={recipient.prefersPost} />
    <CheckboxField label="Prefer to be contacted by phone" bind:checked={recipient.prefersPhone} />
    <CheckboxField label="Prefer to be contacted by email" bind:checked={recipient.prefersEmail} />
    <CheckboxField label="Prefer correspondence in Welsh" bind:checked={recipient.prefersWelsh} />

    {#if recipient.prefersPhone}
      <Field label="Contact phone">
        <TextInput type="tel" bind:value={recipient.contactPhone} />
      </Field>
    {/if}
    {#if recipient.prefersEmail}
      <Field label="Contact email">
        <TextInput type="email" bind:value={recipient.contactEmail} />
      </Field>
    {/if}
  </div>
</section>
