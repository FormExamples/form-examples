<script lang="ts">
  let {
    value = $bindable(''),
    label = 'Signature (typed)',
  }: {
    value: string;
    label?: string;
  } = $props();
</script>

<label class="block">
  <span class="text-sm text-base-content/80 font-medium">{label}</span>
  <span class="text-xs text-base-content/60 block mb-1">
    Type the signatory&rsquo;s full name. A wet-ink signature is required on the printed PDF.
  </span>
  <input
    type="text"
    bind:value
    class="w-full border border-base-300 rounded px-2 py-2 font-serif italic text-lg focus:outline-none focus:ring focus:ring-primary"
    placeholder="(signature)"
  />
</label>
