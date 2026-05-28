<script lang="ts">
  // YesNoToggle — toggle-button pair using the Lily .button[data-variant] + aria-pressed pattern.
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

<div {id} class="button-group" role="radiogroup">
  <button
    type="button"
    class="button"
    data-variant={value === 'yes' ? 'primary' : 'secondary'}
    onclick={() => (value = 'yes')}
    aria-pressed={value === 'yes'}
  >
    Yes
  </button>
  <button
    type="button"
    class="button"
    data-variant={value === 'no' ? 'primary' : 'secondary'}
    onclick={() => (value = 'no')}
    aria-pressed={value === 'no'}
  >
    No
  </button>
</div>
<!-- Hidden hint about the name binding to satisfy form-association expectations. -->
<input type="hidden" {name} {value} />
