<script lang="ts">
  import { store } from '#lib/stores/card.svelte.js';
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">4. Waiting list entry</legend>

  <div class="field">
    <label class="label" for="waiting-list-name">List name</label>
    <input
      id="waiting-list-name"
      type="text"
      class="text-input"
      placeholder="e.g. Orthopaedic — knee replacement"
      bind:value={store.data.waitingList.listName}
    />
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="waiting-specialty">Specialty</label>
      <input
        id="waiting-specialty"
        type="text"
        class="text-input"
        placeholder="e.g. Trauma &amp; Orthopaedics"
        bind:value={store.data.waitingList.specialty}
      />
    </div>

    <div class="field">
      <label class="label" for="waiting-sub-specialty">Sub-specialty</label>
      <input
        id="waiting-sub-specialty"
        type="text"
        class="text-input"
        bind:value={store.data.waitingList.subSpecialty}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="waiting-procedure-description">Procedure description</label>
    <textarea
      id="waiting-procedure-description"
      class="text-area-input"
      rows="3"
      placeholder="Plain-language description of what the patient is waiting to do."
      bind:value={store.data.waitingList.procedureDescription}
    ></textarea>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="waiting-opcs4">OPCS-4 code</label>
      <input
        id="waiting-opcs4"
        type="text"
        class="text-input"
        bind:value={store.data.waitingList.opcs4Code}
      />
    </div>

    <div class="field">
      <label class="label" for="waiting-clinical-priority">Clinical priority</label>
      <select
        id="waiting-clinical-priority"
        class="select"
        bind:value={store.data.waitingList.clinicalPriority}
      >
        <option value="">— select —</option>
        <option value="P1a">P1a — Emergency (24 h)</option>
        <option value="P1b">P1b — Urgent (72 h)</option>
        <option value="P2">P2 — Cancer / time-critical (4 wk)</option>
        <option value="P3">P3 — Substantial harm if delayed (12 wk)</option>
        <option value="P4">P4 — Routine (18-wk RTT)</option>
        <option value="P5">P5 — Deferred (6 mo)</option>
        <option value="P6">P6 — Removed from list</option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="waiting-rtt-clock-start">RTT clock-start date</label>
      <input
        id="waiting-rtt-clock-start"
        type="date"
        class="date-input"
        bind:value={store.data.waitingList.rttClockStartDate}
      />
    </div>

    <div class="field">
      <label class="label" for="waiting-expected-weeks">Expected wait (weeks)</label>
      <input
        id="waiting-expected-weeks"
        type="number"
        class="number-input"
        min="0"
        max="260"
        bind:value={store.data.waitingList.expectedWaitWeeks}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="waiting-expected-procedure-type">Expected procedure type</label>
    <select
      id="waiting-expected-procedure-type"
      class="select"
      bind:value={store.data.waitingList.expectedProcedureType}
    >
      <option value="">— select —</option>
      <option value="first-outpatient-appointment">First outpatient appointment</option>
      <option value="follow-up-appointment">Follow-up appointment</option>
      <option value="day-case-procedure">Day-case procedure</option>
      <option value="inpatient-procedure">Inpatient procedure</option>
      <option value="diagnostic">Diagnostic</option>
      <option value="therapy">Therapy</option>
      <option value="multi-disciplinary-team-review">MDT review</option>
      <option value="other">Other</option>
    </select>
  </div>
</fieldset>
