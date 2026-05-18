<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-3">Step 1 — Respondent identification</h2>
  <p class="text-sm text-slate-600 mb-4">
    Tell us who is completing this checklist and which team or organisation
    you are scoring. None of these fields affect the maturity calculation.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block">
      <span class="text-sm text-slate-700">Full name</span>
      <input
        type="text"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.fullName}
      />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Email</span>
      <input
        type="email"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.email}
      />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Role</span>
      <select
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.role}
      >
        <option value="">—</option>
        <option value="team-member">Team member</option>
        <option value="team-lead">Team lead</option>
        <option value="scrum-master">Scrum master</option>
        <option value="product-owner">Product owner</option>
        <option value="engineering-manager">Engineering manager</option>
        <option value="agile-coach">Agile coach</option>
        <option value="executive-sponsor">Executive sponsor</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Years working in agile environments</span>
      <input
        type="number"
        min="0"
        max="50"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.yearsInAgile}
      />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Team being assessed</span>
      <input
        type="text"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.teamName}
      />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Organisation / programme</span>
      <input
        type="text"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.organisationName}
      />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Assessment date</span>
      <input
        type="date"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.assessmentDate}
      />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Assessment cadence</span>
      <select
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.respondent.assessmentPeriod}
      >
        <option value="">—</option>
        <option value="sprint">Per sprint</option>
        <option value="quarter">Quarterly</option>
        <option value="half-year">Half-yearly</option>
        <option value="annual">Annual</option>
        <option value="ad-hoc">Ad-hoc</option>
      </select>
    </label>
  </div>
</section>
