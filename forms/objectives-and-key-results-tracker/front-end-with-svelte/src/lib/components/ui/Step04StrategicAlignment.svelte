<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="4">
  <h2 class="mb-3 text-xl font-semibold text-base-content">4. Strategic alignment</h2>
  <div class="grid grid-cols-1 gap-3">
    <label class="block text-sm text-base-content/80">Parent summary
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.alignment.sa_parent_summary}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Business value statement
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.alignment.sa_business_value_statement}></textarea>
    </label>
  </div>
</section>
