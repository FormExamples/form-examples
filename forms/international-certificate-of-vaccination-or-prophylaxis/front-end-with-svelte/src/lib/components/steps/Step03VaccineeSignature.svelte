<script lang="ts">
  import { certificateStore } from '#lib/stores/certificate.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  const c = $derived(certificateStore.data);

  function toggleConsent(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    c.patient.consentedToDataSharing = target.checked ? 'yes' : '';
  }
</script>

<Fieldset legend="Vaccinee signature & consent">
  <div class="field">
    <label class="label" for="patientSignature">Signature (typed name as proxy for handwritten signature)</label>
    <input id="patientSignature" class="text-input" bind:value={c.patient.signatureImageDataUrl} />
  </div>
  <label class="flex items-center gap-2">
    <input
      type="checkbox"
      class="checkbox"
      checked={c.patient.consentedToDataSharing === 'yes'}
      onchange={toggleConsent}
    />
    I consent to onward sharing of this certificate data with destination health authorities.
  </label>
</Fieldset>
