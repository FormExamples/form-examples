<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="space-y-3">
  <legend class="text-lg font-semibold">5. Upcoming appointment</legend>

  <div class="grid grid-cols-3 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Appointment date</span>
      <input
        type="date"
        bind:value={store.data.appointment.appointmentDate}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Appointment time</span>
      <input
        type="time"
        bind:value={store.data.appointment.appointmentTime}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Duration (min)</span>
      <input
        type="number"
        min="1"
        max="1440"
        bind:value={store.data.appointment.durationMinutes}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Appointment type</span>
    <select
      bind:value={store.data.appointment.appointmentType}
      class="block w-full border rounded p-2"
    >
      <option value="">— select —</option>
      <option value="first-outpatient">First outpatient</option>
      <option value="follow-up">Follow-up</option>
      <option value="pre-assessment">Pre-assessment</option>
      <option value="diagnostic">Diagnostic</option>
      <option value="treatment">Treatment</option>
      <option value="procedure">Procedure</option>
      <option value="admission">Admission</option>
      <option value="telephone">Telephone</option>
      <option value="video">Video</option>
      <option value="other">Other</option>
    </select>
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Site name</span>
      <input
        type="text"
        bind:value={store.data.appointment.siteName}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Clinic</span>
      <input
        type="text"
        bind:value={store.data.appointment.clinicName}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Site address</span>
    <textarea
      bind:value={store.data.appointment.siteAddress}
      class="block w-full border rounded p-2"
      rows="2"
    ></textarea>
  </label>

  <div class="grid grid-cols-3 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Room</span>
      <input
        type="text"
        bind:value={store.data.appointment.room}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Clinician</span>
      <input
        type="text"
        bind:value={store.data.appointment.clinicianName}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Team</span>
      <input
        type="text"
        bind:value={store.data.appointment.clinicianTeam}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Status</span>
    <select bind:value={store.data.appointment.status} class="block w-full border rounded p-2">
      <option value="scheduled">Scheduled</option>
      <option value="confirmed">Confirmed</option>
      <option value="rebooked">Rebooked</option>
      <option value="cancelled">Cancelled</option>
      <option value="attended">Attended</option>
      <option value="did-not-attend">Did not attend</option>
    </select>
  </label>

  <label class="block">
    <span class="text-sm font-medium">Travel notes</span>
    <textarea
      bind:value={store.data.appointment.travelNotes}
      class="block w-full border rounded p-2"
      rows="2"
      placeholder="Transport, parking, directions."
    ></textarea>
  </label>

  <label class="block">
    <span class="text-sm font-medium">Access notes</span>
    <textarea
      bind:value={store.data.appointment.accessNotes}
      class="block w-full border rounded p-2"
      rows="2"
      placeholder="Step-free access, BSL interpreter booked, etc."
    ></textarea>
  </label>
</fieldset>
