<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">2. Patient identification</legend>

  <div class="field">
    <label class="label" for="patient-name">Name</label>
    <input
      id="patient-name"
      type="text"
      class="text-input"
      autocomplete="name"
      bind:value={store.data.patient.name}
    />
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div class="field">
      <label class="label" for="patient-nhs-number">NHS number</label>
      <input
        id="patient-nhs-number"
        type="text"
        class="text-input"
        inputmode="numeric"
        pattern="[0-9 ]*"
        bind:value={store.data.patient.unitedKingdomNhsNumber}
      />
    </div>

    <div class="field">
      <label class="label" for="patient-birth-date">Date of birth</label>
      <input
        id="patient-birth-date"
        type="date"
        class="date-input"
        bind:value={store.data.patient.birthDate}
      />
    </div>

    <div class="field">
      <label class="label" for="patient-sex">Sex</label>
      <select id="patient-sex" class="select" bind:value={store.data.patient.sex}>
        <option value="">— select —</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="intersex">Intersex</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="patient-email">Email</label>
      <input
        id="patient-email"
        type="email"
        class="text-input"
        bind:value={store.data.patient.email}
      />
    </div>

    <div class="field">
      <label class="label" for="patient-phone">Phone</label>
      <input
        id="patient-phone"
        type="tel"
        class="text-input"
        bind:value={store.data.patient.phone}
      />
    </div>
  </div>

  <div class="field">
    <label class="label" for="patient-postal-address">Postal address</label>
    <textarea
      id="patient-postal-address"
      class="text-area-input"
      rows="3"
      bind:value={store.data.patient.postalAddressAsFullText}
    ></textarea>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="field">
      <label class="label" for="patient-postcode">Postcode</label>
      <input
        id="patient-postcode"
        type="text"
        class="text-input"
        bind:value={store.data.patient.postcode}
      />
    </div>

    <div class="field">
      <label class="label" for="patient-language">Preferred language (ISO 639-1)</label>
      <input
        id="patient-language"
        type="text"
        class="text-input"
        maxlength="2"
        placeholder="en"
        bind:value={store.data.patient.preferredLanguageAsIso6391}
      />
    </div>
  </div>

  <fieldset class="radio-group" aria-label="Interpreter required">
    <span class="label">Interpreter required</span>
    <label>
      <input
        type="radio"
        class="radio-input"
        bind:group={store.data.patient.interpreterRequired}
        value="yes"
      /> Yes
    </label>
    <label>
      <input
        type="radio"
        class="radio-input"
        bind:group={store.data.patient.interpreterRequired}
        value="no"
      /> No
    </label>
  </fieldset>

  <div class="field">
    <label class="label" for="patient-accessibility-needs">Accessibility needs</label>
    <textarea
      id="patient-accessibility-needs"
      class="text-area-input"
      rows="2"
      placeholder="e.g. BSL interpreter, step-free access, large print"
      bind:value={store.data.patient.accessibilityNeeds}
    ></textarea>
  </div>

  <div class="field">
    <label class="label" for="patient-contact-channel">Preferred contact channel</label>
    <select
      id="patient-contact-channel"
      class="select"
      bind:value={store.data.patient.preferredContactChannel}
    >
      <option value="">— select —</option>
      <option value="sms">SMS</option>
      <option value="email">Email</option>
      <option value="phone">Phone</option>
      <option value="letter">Letter</option>
      <option value="nhs-app">NHS App</option>
    </select>
  </div>
</fieldset>
