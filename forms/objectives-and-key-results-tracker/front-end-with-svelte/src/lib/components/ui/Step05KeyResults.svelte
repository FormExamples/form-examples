<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="5">
  <h2 class="mb-3 text-xl font-semibold text-base-content">5. Key Results (1–5)</h2>
  {#each d.keyResults as kr, i (i)}
    <fieldset class="mb-3 rounded border border-base-300 p-3" data-kr={i}>
      <legend class="font-semibold text-base-content">KR {kr.position}
        <button type="button" class="ml-2 text-sm text-error" onclick={() => formState.removeKr(i)}>remove</button>
      </legend>
      <div class="grid grid-cols-2 gap-3">
        <label class="block text-sm text-base-content/80">Title<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={kr.title}/></label>
        <label class="block text-sm text-base-content/80">Type
          <select class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={kr.krType}>
            <option value="">—</option>
            <option value="numeric">numeric</option>
            <option value="milestone">milestone</option>
            <option value="binary">binary</option>
          </select>
        </label>
        <label class="block text-sm text-base-content/80">Start<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" step="any" bind:value={kr.startValue}/></label>
        <label class="block text-sm text-base-content/80">Current<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" step="any" bind:value={kr.currentValue}/></label>
        <label class="block text-sm text-base-content/80">Target<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" step="any" bind:value={kr.targetValue}/></label>
        <label class="block text-sm text-base-content/80">Progress fraction (0–1)<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" step="any" min="0" max="1" bind:value={kr.progressFraction}/></label>
      </div>
    </fieldset>
  {/each}
  <button type="button" class="button" data-variant="primary" disabled={d.keyResults.length >= 5} onclick={() => formState.addKr()}>Add Key Result</button>
</section>
