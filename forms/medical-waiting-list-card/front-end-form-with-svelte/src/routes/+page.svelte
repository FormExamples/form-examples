<script lang="ts">
  import { store } from '$lib/stores/card.svelte.js';
  import { STEPS } from '$lib/config/steps.js';

  import Step1Practitioner from '$lib/components/steps/Step1Practitioner.svelte';
  import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
  import Step3Referral from '$lib/components/steps/Step3Referral.svelte';
  import Step4WaitingList from '$lib/components/steps/Step4WaitingList.svelte';
  import Step5Appointment from '$lib/components/steps/Step5Appointment.svelte';
  import Step6Communication from '$lib/components/steps/Step6Communication.svelte';
  import Step7Signoff from '$lib/components/steps/Step7Signoff.svelte';

  function scrollToStep(n: number) {
    document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<svelte:head>
  <title>Medical Waiting List Card</title>
</svelte:head>

<main class="mx-auto max-w-3xl p-6">
  <header class="mb-6 no-print">
    <h1 class="text-2xl font-bold text-nhs-blue">Medical Waiting List Card</h1>
    <p class="text-sm text-muted">
      Practitioner-completed administrative card. NHS RTT-aligned. Single-page wizard.
    </p>
  </header>

  <nav class="mb-6 no-print" aria-label="Step navigation">
    <ol class="grid grid-cols-7 gap-1 text-xs">
      {#each STEPS as step (step.number)}
        <li>
          <button
            type="button"
            class="block w-full rounded border px-1 py-2 text-left hover:bg-slate-100"
            onclick={() => scrollToStep(step.number)}
          >
            <span class="block font-medium">{step.number}</span>
            <span class="block truncate">{step.title}</span>
          </button>
        </li>
      {/each}
    </ol>
  </nav>

  <form class="space-y-8">
    <section id="step-1" class="rounded border p-4 bg-white">
      <Step1Practitioner />
    </section>

    <section id="step-2" class="rounded border p-4 bg-white">
      <Step2Patient />
    </section>

    <section id="step-3" class="rounded border p-4 bg-white">
      <Step3Referral />
    </section>

    <section id="step-4" class="rounded border p-4 bg-white">
      <Step4WaitingList />
    </section>

    <section id="step-5" class="rounded border p-4 bg-white">
      <Step5Appointment />
    </section>

    <section id="step-6" class="rounded border p-4 bg-white">
      <Step6Communication />
    </section>

    <section id="step-7" class="rounded border p-4 bg-white">
      <Step7Signoff />
    </section>
  </form>

  <footer class="mt-8 flex justify-end gap-3 no-print">
    <button
      type="button"
      onclick={() => store.reset()}
      class="rounded border px-4 py-2 hover:bg-slate-100"
    >
      Reset
    </button>
  </footer>
</main>
