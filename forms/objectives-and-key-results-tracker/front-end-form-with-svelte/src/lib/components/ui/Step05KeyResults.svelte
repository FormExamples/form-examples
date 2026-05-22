<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="5">
  <h2 class="text-xl font-semibold mb-3">5. Key Results (1–5)</h2>
  {#each formState.keyResults as kr, i}
    <fieldset class="border p-3 mb-3" data-kr={i}>
      <legend class="font-semibold">KR {kr.position}
        <button type="button" class="ml-2 text-sm text-red-600" onclick={() => formState.removeKr(i)}>remove</button>
      </legend>
      <div class="grid grid-cols-2 gap-3">
        <label>Title<input class="w-full border p-1" bind:value={kr.title}/></label>
        <label>Type
          <select class="w-full border p-1" bind:value={kr.krType}>
            <option value="">—</option>
            <option value="numeric">numeric</option>
            <option value="milestone">milestone</option>
            <option value="binary">binary</option>
          </select>
        </label>
        <label>Start<input class="w-full border p-1" type="number" step="any" bind:value={kr.startValue}/></label>
        <label>Current<input class="w-full border p-1" type="number" step="any" bind:value={kr.currentValue}/></label>
        <label>Target<input class="w-full border p-1" type="number" step="any" bind:value={kr.targetValue}/></label>
        <label>Progress fraction (0–1)<input class="w-full border p-1" type="number" step="any" min="0" max="1" bind:value={kr.progressFraction}/></label>
      </div>
    </fieldset>
  {/each}
  <button type="button" class="bg-blue-600 text-white px-3 py-1 rounded" disabled={formState.keyResults.length >= 5} onclick={() => formState.addKr()}>Add Key Result</button>
</section>
