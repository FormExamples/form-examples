<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">6. Patient communication</legend>

  <fieldset class="radio-group" aria-label="Consent to reminders">
    <span class="label">Consent to reminders</span>
    <label>
      <input
        type="radio"
        class="radio-input"
        bind:group={store.data.communication.consentToReminders}
        value="yes"
      /> Yes
    </label>
    <label>
      <input
        type="radio"
        class="radio-input"
        bind:group={store.data.communication.consentToReminders}
        value="no"
      /> No
    </label>
  </fieldset>

  <div class="field">
    <label class="label" for="communication-notes">Communication notes</label>
    <textarea
      id="communication-notes"
      class="text-area-input"
      rows="3"
      placeholder="Preferred times to contact, language and interpreter needs, accessibility (BSL, large print, easy read)."
      bind:value={store.data.communication.communicationNotes}
    ></textarea>
  </div>
</fieldset>
