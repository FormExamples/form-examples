<script lang="ts">
  import type { ValidityStatus } from '$lib/data/sample.js';
  interface Props {
    status: ValidityStatus;
  }
  let { status }: Props = $props();

  const cls = $derived(
    status === 'ready-to-register'
      ? 'bg-green-100 text-green-800'
      : status === 'needs-correction'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-red-100 text-red-800',
  );
</script>

<span class="rounded px-2 py-0.5 text-xs font-medium {cls}">{status}</span>
