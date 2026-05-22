<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="1">
  <h2 class="text-xl font-semibold mb-3">1. Reporter &amp; cycle</h2>
  <div class="grid grid-cols-2 gap-3">
    <label>Reporter name<input class="w-full border p-1" bind:value={formState.reporter.name}/></label>
    <label>Reporter email<input class="w-full border p-1" type="email" bind:value={formState.reporter.email}/></label>
    <label>Reporter role<input class="w-full border p-1" bind:value={formState.reporter.role}/></label>
    <label>Level
      <select class="w-full border p-1" bind:value={formState.cycle.level}>
        <option value="">—</option>
        <option value="individual">individual</option>
        <option value="team">team</option>
        <option value="department">department</option>
        <option value="company">company</option>
      </select>
    </label>
    <label>Cycle
      <select class="w-full border p-1" bind:value={formState.cycle.cycle}>
        <option value="">—</option>
        <option value="monthly">monthly</option>
        <option value="quarterly">quarterly</option>
        <option value="half-yearly">half-yearly</option>
        <option value="annual">annual</option>
        <option value="custom">custom</option>
      </select>
    </label>
    <label>Cycle start date<input class="w-full border p-1" type="date" bind:value={formState.cycle.cycleStartDate}/></label>
    <label>Cycle end date<input class="w-full border p-1" type="date" bind:value={formState.cycle.cycleEndDate}/></label>
  </div>
</section>
