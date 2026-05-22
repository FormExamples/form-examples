<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="4">
  <h2 class="text-xl font-semibold mb-3">4. Strategic alignment</h2>
  <div class="grid grid-cols-1 gap-3">
    <label>Parent summary
      <textarea class="w-full border p-1" rows="3" bind:value={formState.alignment.sa_parent_summary}></textarea>
    </label>
    <label>Business value statement
      <textarea class="w-full border p-1" rows="3" bind:value={formState.alignment.sa_business_value_statement}></textarea>
    </label>
  </div>
</section>
