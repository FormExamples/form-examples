<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  const c = $derived(certificateStore.data);

  function toggleConsent(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    c.patient.consentedToDataSharing = target.checked ? 'yes' : '';
  }
</script>

<div class="space-y-3">
  <label class="block">Signature (typed name as proxy for handwritten signature)
    <input class="border rounded w-full p-2" bind:value={c.patient.signatureImageDataUrl} />
  </label>
  <label class="flex items-center gap-2">
    <input type="checkbox"
           checked={c.patient.consentedToDataSharing === 'yes'}
           on:change={toggleConsent} />
    I consent to onward sharing of this certificate data with destination health authorities.
  </label>
</div>
