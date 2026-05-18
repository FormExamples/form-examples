<script lang="ts">
  import type { CertificateRow } from '$lib/types';

  let { rows = [], onChange }: {
    rows?: CertificateRow[];
    onChange: (filters: { disease: string; status: string; centre: string; search: string }) => void;
  } = $props();

  let disease = $state('');
  let status = $state('');
  let centre = $state('');
  let search = $state('');

  const centres = $derived([...new Set(rows.map((r) => r.centre))].sort());

  function emit() {
    onChange({ disease, status, centre, search });
  }
</script>

<section class="flex flex-wrap gap-4 p-4 bg-white border-b">
  <label class="flex flex-col text-sm gap-1">
    Disease
    <select class="border rounded p-1" bind:value={disease} on:change={emit}>
      <option value="">All</option>
      <option value="yellow-fever">yellow-fever</option>
      <option value="polio">polio</option>
      <option value="smallpox">smallpox</option>
      <option value="cholera">cholera</option>
      <option value="meningococcal">meningococcal</option>
      <option value="covid-19">covid-19</option>
      <option value="other">other</option>
    </select>
  </label>
  <label class="flex flex-col text-sm gap-1">
    Status
    <select class="border rounded p-1" bind:value={status} on:change={emit}>
      <option value="">All</option>
      <option>draft</option><option>issued</option>
      <option>reissued</option><option>revoked</option>
    </select>
  </label>
  <label class="flex flex-col text-sm gap-1">
    Centre
    <select class="border rounded p-1" bind:value={centre} on:change={emit}>
      <option value="">All</option>
      {#each centres as c}
        <option value={c}>{c}</option>
      {/each}
    </select>
  </label>
  <label class="flex flex-col text-sm gap-1">
    Search
    <input type="search" class="border rounded p-1" placeholder="surname / given / serial"
           bind:value={search} on:input={emit} />
  </label>
</section>
