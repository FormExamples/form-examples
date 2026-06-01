<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="space-y-3">
  <legend class="text-lg font-semibold">3. Referral details</legend>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Referral source</span>
      <select
        bind:value={store.data.referral.referralSource}
        class="block w-full border rounded p-2"
      >
        <option value="">— select —</option>
        <option value="gp">GP</option>
        <option value="consultant">Consultant</option>
        <option value="a-and-e">A&amp;E</option>
        <option value="self">Self-referral</option>
        <option value="community">Community service</option>
        <option value="screening">Screening programme</option>
        <option value="other">Other</option>
      </select>
    </label>

    <label class="block">
      <span class="text-sm font-medium">Referral date</span>
      <input
        type="date"
        bind:value={store.data.referral.referralDate}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Referral letter reference</span>
    <input
      type="text"
      bind:value={store.data.referral.referralLetterReference}
      class="block w-full border rounded p-2"
    />
  </label>

  <label class="block">
    <span class="text-sm font-medium">Reason for referral</span>
    <textarea
      bind:value={store.data.referral.reasonForReferral}
      class="block w-full border rounded p-2"
      rows="3"
    ></textarea>
  </label>

  <label class="block">
    <span class="text-sm font-medium">Presenting condition</span>
    <textarea
      bind:value={store.data.referral.presentingCondition}
      class="block w-full border rounded p-2"
      rows="3"
    ></textarea>
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">ICD-10 code</span>
      <input
        type="text"
        bind:value={store.data.referral.icd10Code}
        class="block w-full border rounded p-2"
        placeholder="e.g. M17.0"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">SNOMED CT code</span>
      <input
        type="text"
        bind:value={store.data.referral.snomedCtCode}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <fieldset class="border rounded p-3">
    <legend class="px-1 text-sm font-medium">Suspected cancer (two-week wait)</legend>
    <label class="inline-flex items-center mr-4">
      <input type="radio" bind:group={store.data.referral.suspectedCancer} value="yes" />
      <span class="ml-1">Yes</span>
    </label>
    <label class="inline-flex items-center">
      <input type="radio" bind:group={store.data.referral.suspectedCancer} value="no" />
      <span class="ml-1">No</span>
    </label>
  </fieldset>
</fieldset>
