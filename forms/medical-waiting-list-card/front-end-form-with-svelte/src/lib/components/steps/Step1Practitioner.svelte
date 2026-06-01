<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
  const data = $derived(store.data.practitioner);
</script>

<fieldset class="space-y-3">
  <legend class="text-lg font-semibold">1. Practitioner identification</legend>

  <label class="block">
    <span class="text-sm font-medium">Name</span>
    <input
      type="text"
      bind:value={store.data.practitioner.name}
      class="block w-full border rounded p-2"
      autocomplete="name"
    />
  </label>

  <label class="block">
    <span class="text-sm font-medium">Role</span>
    <select bind:value={store.data.practitioner.role} class="block w-full border rounded p-2">
      <option value="">— select —</option>
      <option value="gp">GP</option>
      <option value="consultant">Consultant</option>
      <option value="specialist-nurse">Specialist nurse</option>
      <option value="referral-coordinator">Referral coordinator</option>
      <option value="booking-clerk">Booking clerk</option>
      <option value="rtt-validator">RTT validator</option>
      <option value="other">Other</option>
    </select>
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Registration body</span>
      <select
        bind:value={store.data.practitioner.registrationBody}
        class="block w-full border rounded p-2"
      >
        <option value="">— select —</option>
        <option value="GMC">GMC</option>
        <option value="NMC">NMC</option>
        <option value="HCPC">HCPC</option>
        <option value="GPhC">GPhC</option>
        <option value="other">Other</option>
      </select>
    </label>

    <label class="block">
      <span class="text-sm font-medium">Registration number</span>
      <input
        type="text"
        bind:value={store.data.practitioner.registrationNumber}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Organisation name</span>
    <input
      type="text"
      bind:value={store.data.practitioner.organisationName}
      class="block w-full border rounded p-2"
    />
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">ODS code</span>
      <input
        type="text"
        bind:value={store.data.practitioner.organisationOdsCode}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Site name</span>
      <input
        type="text"
        bind:value={store.data.practitioner.siteName}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Email</span>
      <input
        type="email"
        bind:value={store.data.practitioner.email}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Phone</span>
      <input
        type="tel"
        bind:value={store.data.practitioner.phone}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>
</fieldset>
