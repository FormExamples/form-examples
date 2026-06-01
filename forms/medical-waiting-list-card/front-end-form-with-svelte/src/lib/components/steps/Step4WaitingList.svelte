<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="space-y-3">
  <legend class="text-lg font-semibold">4. Waiting list entry</legend>

  <label class="block">
    <span class="text-sm font-medium">List name</span>
    <input
      type="text"
      bind:value={store.data.waitingList.listName}
      class="block w-full border rounded p-2"
      placeholder="e.g. Orthopaedic — knee replacement"
    />
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Specialty</span>
      <input
        type="text"
        bind:value={store.data.waitingList.specialty}
        class="block w-full border rounded p-2"
        placeholder="e.g. Trauma &amp; Orthopaedics"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Sub-specialty</span>
      <input
        type="text"
        bind:value={store.data.waitingList.subSpecialty}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Procedure description</span>
    <textarea
      bind:value={store.data.waitingList.procedureDescription}
      class="block w-full border rounded p-2"
      rows="3"
      placeholder="Plain-language description of what the patient is waiting to do."
    ></textarea>
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">OPCS-4 code</span>
      <input
        type="text"
        bind:value={store.data.waitingList.opcs4Code}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Clinical priority</span>
      <select
        bind:value={store.data.waitingList.clinicalPriority}
        class="block w-full border rounded p-2"
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
    </label>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">RTT clock-start date</span>
      <input
        type="date"
        bind:value={store.data.waitingList.rttClockStartDate}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Expected wait (weeks)</span>
      <input
        type="number"
        min="0"
        max="260"
        bind:value={store.data.waitingList.expectedWaitWeeks}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Expected procedure type</span>
    <select
      bind:value={store.data.waitingList.expectedProcedureType}
      class="block w-full border rounded p-2"
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
  </label>
</fieldset>
