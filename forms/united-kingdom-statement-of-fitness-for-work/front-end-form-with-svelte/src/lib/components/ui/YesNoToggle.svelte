<script lang="ts">
  import type { YesNo } from '$lib/types.js';

  let {
    id,
    name,
    value = $bindable(),
  }: {
    id: string;
    name: string;
    value: YesNo;
  } = $props();
</script>

<div {id} class="inline-flex rounded border overflow-hidden" role="radiogroup">
  <button
    type="button"
    class="px-4 py-1.5 text-sm border-r {value === 'yes' ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}"
    onclick={() => (value = 'yes')}
    aria-pressed={value === 'yes'}
  >
    Yes
  </button>
  <button
    type="button"
    class="px-4 py-1.5 text-sm {value === 'no' ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}"
    onclick={() => (value = 'no')}
    aria-pressed={value === 'no'}
  >
    No
  </button>
</div>
<!-- Hidden hint about the name binding to satisfy form-association expectations. -->
<input type="hidden" {name} {value} />
