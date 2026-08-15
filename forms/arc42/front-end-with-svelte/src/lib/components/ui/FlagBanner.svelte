<script lang="ts">
  // FlagBanner — Lily Svelte headless contract (alert + data-type).
  import type { AdditionalFlag } from '#lib/grading/types.js';

  let { flags }: { flags: AdditionalFlag[] } = $props();

  function alertType(priority: 'high' | 'medium' | 'low'): 'error' | 'warning' | 'info' {
    if (priority === 'high') return 'error';
    if (priority === 'medium') return 'warning';
    return 'info';
  }
</script>

{#each flags as flag}
  <div class="alert" data-type={alertType(flag.priority)} role="alert">
    <p>
      <strong>[{flag.priority.toUpperCase()}]</strong>
      {flag.description}
    </p>
  </div>
{/each}
