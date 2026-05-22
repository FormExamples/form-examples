<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const options = [
    {
      value: 'as_soon_as_registered',
      label:
        'As soon as the LPA is registered (recommended) \u2014 attorneys may help with finances while the donor still has capacity, with the donor\u2019s consent.',
    },
    {
      value: 'only_when_no_capacity',
      label:
        'Only when the donor does not have mental capacity \u2014 attorneys cannot act until evidence of incapacity is provided.',
    },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 5 &mdash; When attorneys can act (LP1F section 5)</h2>
  <p class="text-sm text-slate-600 mb-3">
    Decide when the attorneys can begin using the LPA. The &ldquo;only when no capacity&rdquo; option
    significantly restricts day-to-day usefulness.
  </p>
  <RadioGroup name="whenCanAct" {options} bind:value={store.data.whenAttorneysCanAct} />
</section>
