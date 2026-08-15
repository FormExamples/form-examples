<script lang="ts">
  import { store } from '#lib/stores/card.svelte.js';
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">1. Practitioner identification</legend>

  <div class="field">
    <label class="label" for="practitioner-name">Name</label>
    <input
      id="practitioner-name"
      type="text"
      class="text-input"
      autocomplete="name"
      bind:value={store.data.practitioner.name}
    />
  </div>

  <div class="field">
    <label class="label" for="practitioner-role">Role</label>
    <select id="practitioner-role" class="select" bind:value={store.data.practitioner.role}>
      <option value="">— select —</option>
      <option value="gp">GP</option>
      <option value="consultant">Consultant</option>
      <option value="specialist-nurse">Specialist nurse</option>
      <option value="referral-coordinator">Referral coordinator</option>
      <option value="booking-clerk">Booking clerk</option>
      <option value="rtt-validator">RTT validator</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="practitioner-registration-body">Registration body</label>
      <select
        id="practitioner-registration-body"
        class="select"
        bind:value={store.data.practitioner.registrationBody}
      >
        <option value="">— select —</option>
        <option value="GMC">GMC</option>
        <option value="NMC">NMC</option>
        <option value="HCPC">HCPC</option>
        <option value="GPhC">GPhC</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="field">
      <label class="label" for="practitioner-registration-number">Registration number</label>
      <input
        id="practitioner-registration-number"
        type="text"
        class="text-input"
        bind:value={store.data.practitioner.registrationNumber}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="practitioner-organisation-name">Organisation name</label>
    <input
      id="practitioner-organisation-name"
      type="text"
      class="text-input"
      bind:value={store.data.practitioner.organisationName}
    />
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="practitioner-ods-code">ODS code</label>
      <input
        id="practitioner-ods-code"
        type="text"
        class="text-input"
        bind:value={store.data.practitioner.organisationOdsCode}
      />
    </div>

    <div class="field">
      <label class="label" for="practitioner-site-name">Site name</label>
      <input
        id="practitioner-site-name"
        type="text"
        class="text-input"
        bind:value={store.data.practitioner.siteName}
      />
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="practitioner-email">Email</label>
      <input
        id="practitioner-email"
        type="email"
        class="text-input"
        bind:value={store.data.practitioner.email}
      />
    </div>

    <div class="field">
      <label class="label" for="practitioner-phone">Phone</label>
      <input
        id="practitioner-phone"
        type="tel"
        class="text-input"
        bind:value={store.data.practitioner.phone}
      />
    </div>
  </div>
</fieldset>
