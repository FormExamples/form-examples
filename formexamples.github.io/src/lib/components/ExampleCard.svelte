<script lang="ts">
  import { REPO_URL } from '$lib/site';
  import type { ExampleEntry } from '$lib/data/examples.generated';

  type Props = { example: ExampleEntry };
  let { example }: Props = $props();

  let personasUrl = $derived(`${REPO_URL}/blob/main/forms/${example.slug}/examples/personas.json`);
  let formUrl = $derived(`${REPO_URL}/tree/main/forms/${example.slug}`);
</script>

<div class="rounded-lg border border-base-300 p-5">
  <a href={formUrl} target="_blank" rel="noopener noreferrer" class="font-semibold text-base-content no-underline hover:text-primary">
    {example.title}
  </a>
  <span class="ml-1 text-xs text-muted">{example.slug}</span>
  {#if example.description}
    <p class="mt-2 text-sm text-muted">{example.description}</p>
  {/if}
  <div class="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
    {example.personas.length} worked {example.personas.length === 1 ? 'example' : 'examples'}
  </div>
  <ul class="mt-2 space-y-1.5">
    {#each example.personas as persona}
      <li class="text-sm">
        <span class="font-medium text-base-content">{persona.name}</span>
        {#if persona.description}
          <span class="text-muted"> — {persona.description}</span>
        {/if}
      </li>
    {/each}
  </ul>
  <a href={personasUrl} target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-sm text-primary no-underline hover:underline">
    View personas.json →
  </a>
</div>
