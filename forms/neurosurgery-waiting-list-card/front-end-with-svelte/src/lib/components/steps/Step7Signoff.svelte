<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">7. Sign-off</legend>

  <div class="field">
    <label class="label" for="signoff-status">Card status</label>
    <select id="signoff-status" class="select" bind:value={store.data.status}>
      <option value="draft">Draft</option>
      <option value="submitted">Submitted</option>
      <option value="reviewed">Reviewed</option>
      <option value="closed">Closed</option>
    </select>
  </div>

  <div class="field">
    <label class="label" for="signoff-additional-notes">Additional notes</label>
    <textarea
      id="signoff-additional-notes"
      class="text-area-input"
      rows="3"
      bind:value={store.data.signoff.additionalNotes}
    ></textarea>
  </div>

  <p class="hint">
    The Waiting Time Status, days-to-target, days-to-breach, and any flagged
    issues are computed against today's date when you submit the card.
  </p>
</fieldset>
