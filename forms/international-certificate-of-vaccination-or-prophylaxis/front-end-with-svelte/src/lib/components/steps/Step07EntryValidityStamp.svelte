<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  const e = $derived(certificateStore.data.entries[0]);
</script>

<Fieldset legend="Vaccination entry — validity & stamp" description="Yellow fever validity starts 10 days after vaccination and is lifetime per the 2016 IHR amendment.">
  <div class="field">
    <label class="label" for="validityStart">Validity starts on</label>
    <input id="validityStart" type="date" class="date-input" bind:value={e.validityStartsOn} />
  </div>
  <div class="field">
    <label class="label" for="validityEnd">Validity ends on</label>
    <input id="validityEnd" type="date" class="date-input" bind:value={e.validityEndsOn} />
  </div>
  <div class="field">
    <label class="label" for="lifetime">Validity is lifetime (yellow fever per 2016 IHR amendment)</label>
    <select id="lifetime" class="select" bind:value={e.validityIsLifetime}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="stampImage">Centre stamp image (data URL)</label>
    <input id="stampImage" class="text-input" bind:value={e.centreStampImageDataUrl} />
  </div>
  <div class="field">
    <label class="label" for="stampApplied">Centre stamp applied</label>
    <select id="stampApplied" class="select" bind:value={e.centreStampApplied}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </div>
</Fieldset>
