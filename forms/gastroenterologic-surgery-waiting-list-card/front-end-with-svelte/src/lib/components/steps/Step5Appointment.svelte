<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">5. Upcoming appointment</legend>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div class="field">
      <label class="label" for="appointment-date">Appointment date</label>
      <input
        id="appointment-date"
        type="date"
        class="date-input"
        bind:value={store.data.appointment.appointmentDate}
      />
    </div>

    <div class="field">
      <label class="label" for="appointment-time">Appointment time</label>
      <input
        id="appointment-time"
        type="time"
        class="time-input"
        bind:value={store.data.appointment.appointmentTime}
      />
    </div>

    <div class="field">
      <label class="label" for="appointment-duration">Duration (min)</label>
      <input
        id="appointment-duration"
        type="number"
        class="number-input"
        min="1"
        max="1440"
        bind:value={store.data.appointment.durationMinutes}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="appointment-type">Appointment type</label>
    <select id="appointment-type" class="select" bind:value={store.data.appointment.appointmentType}>
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
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="appointment-site-name">Site name</label>
      <input
        id="appointment-site-name"
        type="text"
        class="text-input"
        bind:value={store.data.appointment.siteName}
      />
    </div>

    <div class="field">
      <label class="label" for="appointment-clinic-name">Clinic</label>
      <input
        id="appointment-clinic-name"
        type="text"
        class="text-input"
        bind:value={store.data.appointment.clinicName}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="appointment-site-address">Site address</label>
    <textarea
      id="appointment-site-address"
      class="text-area-input"
      rows="2"
      bind:value={store.data.appointment.siteAddress}
    ></textarea>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div class="field">
      <label class="label" for="appointment-room">Room</label>
      <input
        id="appointment-room"
        type="text"
        class="text-input"
        bind:value={store.data.appointment.room}
      />
    </div>

    <div class="field">
      <label class="label" for="appointment-clinician">Clinician</label>
      <input
        id="appointment-clinician"
        type="text"
        class="text-input"
        bind:value={store.data.appointment.clinicianName}
      />
    </div>

    <div class="field">
      <label class="label" for="appointment-team">Team</label>
      <input
        id="appointment-team"
        type="text"
        class="text-input"
        bind:value={store.data.appointment.clinicianTeam}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="appointment-status">Status</label>
    <select id="appointment-status" class="select" bind:value={store.data.appointment.status}>
      <option value="scheduled">Scheduled</option>
      <option value="confirmed">Confirmed</option>
      <option value="rebooked">Rebooked</option>
      <option value="cancelled">Cancelled</option>
      <option value="attended">Attended</option>
      <option value="did-not-attend">Did not attend</option>
    </select>
  </div>

  <div class="field">
    <label class="label" for="appointment-travel-notes">Travel notes</label>
    <textarea
      id="appointment-travel-notes"
      class="text-area-input"
      rows="2"
      placeholder="Transport, parking, directions."
      bind:value={store.data.appointment.travelNotes}
    ></textarea>
  </div>

  <div class="field">
    <label class="label" for="appointment-access-notes">Access notes</label>
    <textarea
      id="appointment-access-notes"
      class="text-area-input"
      rows="2"
      placeholder="Step-free access, BSL interpreter booked, etc."
      bind:value={store.data.appointment.accessNotes}
    ></textarea>
  </div>
</fieldset>
