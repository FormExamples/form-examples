<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">3. Referral details</legend>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="referral-source">Referral source</label>
      <select id="referral-source" class="select" bind:value={store.data.referral.referralSource}>
        <option value="">— select —</option>
        <option value="gp">GP</option>
        <option value="consultant">Consultant</option>
        <option value="a-and-e">A&amp;E</option>
        <option value="self">Self-referral</option>
        <option value="community">Community service</option>
        <option value="screening">Screening programme</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="field">
      <label class="label" for="referral-date">Referral date</label>
      <input
        id="referral-date"
        type="date"
        class="date-input"
        bind:value={store.data.referral.referralDate}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="referral-letter-reference">Referral letter reference</label>
    <input
      id="referral-letter-reference"
      type="text"
      class="text-input"
      bind:value={store.data.referral.referralLetterReference}
    />
  </div>

  <div class="field">
    <label class="label" for="referral-reason">Reason for referral</label>
    <textarea
      id="referral-reason"
      class="text-area-input"
      rows="3"
      bind:value={store.data.referral.reasonForReferral}
    ></textarea>
  </div>

  <div class="field">
    <label class="label" for="referral-presenting-condition">Presenting condition</label>
    <textarea
      id="referral-presenting-condition"
      class="text-area-input"
      rows="3"
      bind:value={store.data.referral.presentingCondition}
    ></textarea>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="referral-icd10">ICD-10 code</label>
      <input
        id="referral-icd10"
        type="text"
        class="text-input"
        placeholder="e.g. M17.0"
        bind:value={store.data.referral.icd10Code}
      />
    </div>

    <div class="field">
      <label class="label" for="referral-snomed">SNOMED CT code</label>
      <input
        id="referral-snomed"
        type="text"
        class="text-input"
        bind:value={store.data.referral.snomedCtCode}
      />
    </div>
  </div>

  <fieldset class="radio-group" aria-label="Suspected cancer">
    <span class="label">Suspected cancer (two-week wait)</span>
    <label>
      <input
        type="radio"
        class="radio-input"
        bind:group={store.data.referral.suspectedCancer}
        value="yes"
      /> Yes
    </label>
    <label>
      <input
        type="radio"
        class="radio-input"
        bind:group={store.data.referral.suspectedCancer}
        value="no"
      /> No
    </label>
  </fieldset>
</fieldset>
