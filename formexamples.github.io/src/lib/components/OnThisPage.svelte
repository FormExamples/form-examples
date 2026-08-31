<script lang="ts">
  type Section = { id: string; label: string };
  type Props = { sections: Section[] };
  let { sections }: Props = $props();
</script>

<aside class="hidden xl:fixed xl:right-8 xl:top-24 xl:block xl:w-56" aria-label="On this page">
  <div class="text-xs font-semibold uppercase tracking-wide text-muted">On this page</div>
  <ul class="mt-3 space-y-2 text-sm">
    {#each sections as s}
      <li>
        <a href={`#${s.id}`} class="text-muted hover:text-primary">{s.label}</a>
      </li>
    {/each}
  </ul>
</aside>
