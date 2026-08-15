<script lang="ts">
  import YesNoField from '#lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '#lib/stores/lpa.svelte.js';

  const app = $derived(lpaStore.application);
  function changed() {
    lpaStore.recompute();
  }
</script>

<div class="space-y-4">
  <p class="text-sm text-base-content/80">
    Under MCA 2005 s.11(7) the donor must choose <strong>Option A</strong> or
    <strong>Option B</strong> on life-sustaining treatment. Without an explicit choice
    attorneys have no authority over life-sustaining treatment.
  </p>

  <fieldset class="space-y-3">
    <legend class="text-sm font-medium text-base-content/80">Life-sustaining treatment</legend>

    <label class="flex items-start gap-3 rounded border border-base-300 bg-base-100 p-4">
      <input
        type="radio"
        name="lst"
        value="option-a"
        bind:group={app.lstChoice}
        onchange={changed}
        class="mt-1"
      />
      <div>
        <div class="font-medium text-base-content">Option A</div>
        <p class="text-sm text-base-content/70">
          Attorneys <em>may</em> give or refuse consent to life-sustaining treatment on the
          donor's behalf.
        </p>
      </div>
    </label>

    <label class="flex items-start gap-3 rounded border border-base-300 bg-base-100 p-4">
      <input
        type="radio"
        name="lst"
        value="option-b"
        bind:group={app.lstChoice}
        onchange={changed}
        class="mt-1"
      />
      <div>
        <div class="font-medium text-base-content">Option B</div>
        <p class="text-sm text-base-content/70">
          Attorneys do <em>not</em> have authority over life-sustaining treatment. The
          decision falls to clinicians under MCA s.4 best-interests, or to a valid ADRT.
        </p>
      </div>
    </label>
  </fieldset>

  {#if app.lstChoice !== ''}
    <YesNoField
      label="Has the donor initialled the chosen option?"
      bind:value={app.lstDonorInitialled}
      hint="LP1H requires the donor to personally initial — not merely tick — the chosen box (R-MCA-LST-INITIAL)."
      onchange={changed}
    />
  {/if}
</div>
