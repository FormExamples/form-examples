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
  <span class="text-sm text-slate-700 font-medium">{label}</span>
  <span class="text-xs text-slate-500 block mb-1">
    Type the signatory&rsquo;s full name. A wet-ink signature is required on the printed PDF.
  </span>
  <input
    type="text"
    bind:value
    class="w-full border border-slate-300 rounded px-2 py-2 font-serif italic text-lg focus:outline-none focus:ring focus:ring-brand-500"
    placeholder="(signature)"
  />
</label>
