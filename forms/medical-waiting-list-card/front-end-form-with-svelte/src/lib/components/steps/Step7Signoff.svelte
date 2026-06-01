<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';

  const result = $derived(store.result);

  function sign() {
    store.data.signoff.signedAt = new Date().toISOString();
    store.data.status = 'submitted';
  }
</script>

<fieldset class="space-y-3">
  <legend class="text-lg font-semibold">7. Sign-off</legend>

  <section class="rounded border bg-slate-50 p-3 space-y-2">
    <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Computed result</h3>

    <p class="text-sm">
      <strong>Waiting Time Status:</strong>
      <span class="inline-block rounded bg-white border px-2 py-0.5">
        {result.waitingTimeStatus || '—'}
      </span>
    </p>

    <dl class="grid grid-cols-3 gap-2 text-sm">
      <div>
        <dt class="text-muted">Clinical priority</dt>
        <dd>{result.clinicalPriority || '—'}</dd>
      </div>
      <div>
        <dt class="text-muted">Target wait (wk)</dt>
        <dd>{result.targetWaitWeeks ?? '—'}</dd>
      </div>
      <div>
        <dt class="text-muted">Days waited</dt>
        <dd>{result.daysWaited ?? '—'}</dd>
      </div>
      <div>
        <dt class="text-muted">Days to target</dt>
        <dd>{result.daysToTarget ?? '—'}</dd>
      </div>
      <div>
        <dt class="text-muted">Days to breach</dt>
        <dd>{result.daysToBreach ?? '—'}</dd>
      </div>
      <div>
        <dt class="text-muted">Days to appointment</dt>
        <dd>{result.daysToAppointment ?? '—'}</dd>
      </div>
    </dl>

    {#if result.firedRules.length > 0}
      <details>
        <summary class="cursor-pointer text-sm font-medium">
          Fired rules ({result.firedRules.length})
        </summary>
        <ul class="list-disc pl-6 text-sm">
          {#each result.firedRules as rule (rule.ruleId)}
            <li><code>{rule.ruleId}</code> — {rule.description}</li>
          {/each}
        </ul>
      </details>
    {/if}

    {#if result.additionalFlags.length > 0}
      <details>
        <summary class="cursor-pointer text-sm font-medium">
          Flags ({result.additionalFlags.length})
        </summary>
        <ul class="list-disc pl-6 text-sm">
          {#each result.additionalFlags as flag (flag.flagId)}
            <li>
              <strong>[{flag.priority}]</strong>
              <code>{flag.category}</code> — {flag.description}
            </li>
          {/each}
        </ul>
      </details>
    {/if}
  </section>

  <label class="block">
    <span class="text-sm font-medium">Additional notes</span>
    <textarea
      bind:value={store.data.signoff.additionalNotes}
      class="block w-full border rounded p-2"
      rows="3"
    ></textarea>
  </label>

  <div class="flex items-center gap-3">
    <button
      type="button"
      onclick={sign}
      class="rounded bg-primary px-4 py-2 text-white hover:bg-primary-dark"
    >
      Sign and submit
    </button>
    {#if store.data.signoff.signedAt}
      <span class="text-sm text-success">
        Signed at {store.data.signoff.signedAt}
      </span>
    {/if}
  </div>
</fieldset>
