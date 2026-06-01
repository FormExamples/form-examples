<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="space-y-3">
  <legend class="text-lg font-semibold">6. Patient communication</legend>

  <fieldset class="border rounded p-3">
    <legend class="px-1 text-sm font-medium">Consent to reminders</legend>
    <label class="inline-flex items-center mr-4">
      <input type="radio" bind:group={store.data.communication.consentToReminders} value="yes" />
      <span class="ml-1">Yes</span>
    </label>
    <label class="inline-flex items-center">
      <input type="radio" bind:group={store.data.communication.consentToReminders} value="no" />
      <span class="ml-1">No</span>
    </label>
  </fieldset>

  <label class="block">
    <span class="text-sm font-medium">Communication notes</span>
    <textarea
      bind:value={store.data.communication.communicationNotes}
      class="block w-full border rounded p-2"
      rows="3"
      placeholder="Preferred times to contact, language and interpreter needs, accessibility (BSL, large print, easy read)."
    ></textarea>
  </label>
</fieldset>
