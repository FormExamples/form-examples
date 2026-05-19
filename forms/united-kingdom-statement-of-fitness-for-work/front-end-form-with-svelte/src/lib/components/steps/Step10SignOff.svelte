<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import Report from '$lib/components/Report.svelte';
  import TextArea from '$lib/components/ui/TextArea.svelte';
  import YesNoToggle from '$lib/components/ui/YesNoToggle.svelte';
  import { store } from '$lib/store.svelte.js';
  import { ISSUED_VIA_OPTIONS, PRACTICE_SETTINGS } from '$lib/types.js';
</script>

<section aria-labelledby="step10-heading">
  <h2 id="step10-heading" class="text-xl font-semibold mb-4">Step 10 — Sign-off</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field id="issued-at" label="Issue date">
      <input
        id="issued-at"
        type="date"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.issuedAt}
      />
    </Field>
    <Field id="issued-via" label="Issued via">
      <select
        id="issued-via"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.issuedVia}
      >
        <option value="">—</option>
        {#each ISSUED_VIA_OPTIONS as v (v.value)}
          <option value={v.value}>{v.label}</option>
        {/each}
      </select>
    </Field>
    <Field id="issue-setting" label="Issue setting">
      <select
        id="issue-setting"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.issueSetting}
      >
        <option value="">—</option>
        {#each PRACTICE_SETTINGS as s (s.value)}
          <option value={s.value}>{s.label}</option>
        {/each}
      </select>
    </Field>
    <Field id="safeguarding-concern" label="Safeguarding concern raised?">
      <YesNoToggle
        id="safeguarding-concern"
        name="safeguardingConcern"
        bind:value={store.data.safeguardingConcern}
      />
    </Field>
    <Field id="safeguarding-notes" label="Safeguarding notes (not printed on fit note)">
      <TextArea
        id="safeguarding-notes"
        name="safeguardingNotes"
        rows={3}
        bind:value={store.data.safeguardingNotes}
      />
    </Field>
  </div>

  <Report result={store.result} />
</section>
