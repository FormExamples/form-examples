<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="1">
  <h2 class="mb-3 text-xl font-semibold text-base-content">1. Reporter &amp; cycle</h2>
  <div class="grid grid-cols-2 gap-3">
    <label class="block text-sm text-base-content/80">Reporter name<input id="reporterName" class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.reporter.name}/></label>
    <label class="block text-sm text-base-content/80">Reporter email<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="email" bind:value={d.reporter.email}/></label>
    <label class="block text-sm text-base-content/80">Reporter role<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.reporter.role}/></label>
    <label class="block text-sm text-base-content/80">Level
      <select class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.cycle.level}>
        <option value="">—</option>
        <option value="individual">individual</option>
        <option value="team">team</option>
        <option value="department">department</option>
        <option value="company">company</option>
      </select>
    </label>
    <label class="block text-sm text-base-content/80">Cycle
      <select class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.cycle.cycle}>
        <option value="">—</option>
        <option value="monthly">monthly</option>
        <option value="quarterly">quarterly</option>
        <option value="half-yearly">half-yearly</option>
        <option value="annual">annual</option>
        <option value="custom">custom</option>
      </select>
    </label>
    <label class="block text-sm text-base-content/80">Cycle start date<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="date" bind:value={d.cycle.cycleStartDate}/></label>
    <label class="block text-sm text-base-content/80">Cycle end date<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="date" bind:value={d.cycle.cycleEndDate}/></label>
  </div>
</section>
