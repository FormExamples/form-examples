<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="space-y-3">
  <legend class="text-lg font-semibold">2. Patient identification</legend>

  <label class="block">
    <span class="text-sm font-medium">Name</span>
    <input
      type="text"
      bind:value={store.data.patient.name}
      class="block w-full border rounded p-2"
      autocomplete="name"
    />
  </label>

  <div class="grid grid-cols-3 gap-3">
    <label class="block">
      <span class="text-sm font-medium">NHS number</span>
      <input
        type="text"
        bind:value={store.data.patient.unitedKingdomNhsNumber}
        class="block w-full border rounded p-2"
        inputmode="numeric"
        pattern="[0-9 ]*"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Date of birth</span>
      <input
        type="date"
        bind:value={store.data.patient.birthDate}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Sex</span>
      <select bind:value={store.data.patient.sex} class="block w-full border rounded p-2">
        <option value="">— select —</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="intersex">Intersex</option>
        <option value="unknown">Unknown</option>
      </select>
    </label>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Email</span>
      <input
        type="email"
        bind:value={store.data.patient.email}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Phone</span>
      <input
        type="tel"
        bind:value={store.data.patient.phone}
        class="block w-full border rounded p-2"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Postal address</span>
    <textarea
      bind:value={store.data.patient.postalAddressAsFullText}
      class="block w-full border rounded p-2"
      rows="3"
    ></textarea>
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium">Postcode</span>
      <input
        type="text"
        bind:value={store.data.patient.postcode}
        class="block w-full border rounded p-2"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium">Preferred language (ISO 639-1)</span>
      <input
        type="text"
        maxlength="2"
        bind:value={store.data.patient.preferredLanguageAsIso6391}
        class="block w-full border rounded p-2"
        placeholder="en"
      />
    </label>
  </div>

  <fieldset class="border rounded p-3">
    <legend class="px-1 text-sm font-medium">Interpreter required</legend>
    <label class="inline-flex items-center mr-4">
      <input type="radio" bind:group={store.data.patient.interpreterRequired} value="yes" />
      <span class="ml-1">Yes</span>
    </label>
    <label class="inline-flex items-center">
      <input type="radio" bind:group={store.data.patient.interpreterRequired} value="no" />
      <span class="ml-1">No</span>
    </label>
  </fieldset>

  <label class="block">
    <span class="text-sm font-medium">Accessibility needs</span>
    <textarea
      bind:value={store.data.patient.accessibilityNeeds}
      class="block w-full border rounded p-2"
      rows="2"
      placeholder="e.g. BSL interpreter, step-free access, large print"
    ></textarea>
  </label>

  <label class="block">
    <span class="text-sm font-medium">Preferred contact channel</span>
    <select
      bind:value={store.data.patient.preferredContactChannel}
      class="block w-full border rounded p-2"
    >
      <option value="">— select —</option>
      <option value="sms">SMS</option>
      <option value="email">Email</option>
      <option value="phone">Phone</option>
      <option value="letter">Letter</option>
      <option value="nhs-app">NHS App</option>
    </select>
  </label>
</fieldset>
