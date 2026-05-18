<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  const e = $derived(certificateStore.data.entries[0]);
</script>

<div class="space-y-3">
  <label class="block">Validity starts on
    <input type="date" class="border rounded w-full p-2" bind:value={e.validityStartsOn} />
  </label>
  <label class="block">Validity ends on
    <input type="date" class="border rounded w-full p-2" bind:value={e.validityEndsOn} />
  </label>
  <label class="block">Validity is lifetime (yellow fever per 2016 IHR amendment)
    <select class="border rounded w-full p-2" bind:value={e.validityIsLifetime}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </label>
  <label class="block">Centre stamp image (data URL)
    <input class="border rounded w-full p-2" bind:value={e.centreStampImageDataUrl} />
  </label>
  <label class="block">Centre stamp applied
    <select class="border rounded w-full p-2" bind:value={e.centreStampApplied}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </label>
</div>
