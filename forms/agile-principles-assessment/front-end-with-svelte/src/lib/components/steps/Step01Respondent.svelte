<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';

  function toggleAnonymous(ev: Event) {
    const checked = (ev.currentTarget as HTMLInputElement).checked;
    store.data.respondent.isAnonymous = checked;
    if (checked) {
      store.data.respondent.fullName = '';
      store.data.respondent.email = '';
      store.data.respondent.role = '';
    }
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-3">Step 1 — Respondent identification</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tell us who is completing this assessment and which team or organisation
    you are scoring. None of these fields affect the maturity calculation.
  </p>

  <label class="flex items-start gap-3 mb-4 p-3 border border-base-300 rounded bg-base-200 cursor-pointer">
    <input
      type="checkbox"
      class="mt-1"
      checked={store.data.respondent.isAnonymous}
      onchange={toggleAnonymous}
    />
    <span class="text-sm">
      <span class="font-medium">Submit anonymously.</span>
      <span class="text-base-content/70">
        When checked, name, email, and role are cleared and excluded from the
        report. Team and organisation context are still recorded so coaching
        aggregates can group the response.
      </span>
    </span>
  </label>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block" class:opacity-50={store.data.respondent.isAnonymous}>
      <span class="text-sm text-base-content/70">Full name</span>
      <input
        type="text"
        class="w-full border border-base-300 rounded px-2 py-1 disabled:bg-base-200"
        disabled={store.data.respondent.isAnonymous}
        bind:value={store.data.respondent.fullName}
      />
    </label>
    <label class="block" class:opacity-50={store.data.respondent.isAnonymous}>
      <span class="text-sm text-base-content/70">Email</span>
      <input
        type="email"
        class="w-full border border-base-300 rounded px-2 py-1 disabled:bg-base-200"
        disabled={store.data.respondent.isAnonymous}
        bind:value={store.data.respondent.email}
      />
    </label>
    <label class="block" class:opacity-50={store.data.respondent.isAnonymous}>
      <span class="text-sm text-base-content/70">Role</span>
      <select
        class="w-full border border-base-300 rounded px-2 py-1 disabled:bg-base-200"
        disabled={store.data.respondent.isAnonymous}
        bind:value={store.data.respondent.role}
      >
        <option value="">—</option>
        <option value="individual-contributor">Individual contributor</option>
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
      <span class="text-sm text-base-content/70">Years working in agile environments</span>
      <input
        type="number"
        min="0"
        max="50"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.respondent.yearsInAgile}
      />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/70">Team being assessed</span>
      <input
        id="teamName"
        type="text"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.respondent.teamName}
      />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/70">Organisation / programme</span>
      <input
        type="text"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.respondent.organisationName}
      />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/70">Assessment date</span>
      <input
        id="assessmentDate"
        type="date"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.respondent.assessmentDate}
      />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/70">Assessment cadence</span>
      <select
        class="w-full border border-base-300 rounded px-2 py-1"
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
