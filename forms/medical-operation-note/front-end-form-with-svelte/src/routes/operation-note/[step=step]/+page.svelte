<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { store } from '$lib/state.svelte.js';
  import { STEPS, TOTAL_STEPS } from '$lib/config/steps.js';

  import Form from '$lib/components/ui/Form.svelte';
  import Progress from '$lib/components/ui/Progress.svelte';
  import StepList from '$lib/components/ui/StepList.svelte';
  import StepListItem from '$lib/components/ui/StepListItem.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  import Step1 from '$lib/steps/Step1Identification.svelte';
  import Step2 from '$lib/steps/Step2PatientIdentification.svelte';
  import Step3 from '$lib/steps/Step3SurgicalTeam.svelte';
  import Step4 from '$lib/steps/Step4DiagnosesProcedures.svelte';
  import Step5 from '$lib/steps/Step5Anaesthesia.svelte';
  import Step6 from '$lib/steps/Step6PositionPrepApproach.svelte';
  import Step7 from '$lib/steps/Step7OperativeFindings.svelte';
  import Step8 from '$lib/steps/Step8MaterialsImplants.svelte';
  import Step9 from '$lib/steps/Step9DrainsPacksSpecimens.svelte';
  import Step10 from '$lib/steps/Step10SafetyCountsEbl.svelte';
  import Step11 from '$lib/steps/Step11PostOperativePlan.svelte';
  import Step12 from '$lib/steps/Step12SignOff.svelte';

  const componentsByStep = [
    null,
    Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10, Step11, Step12,
  ];

  const stepNum = $derived(Number($page.params.step));

  $effect(() => {
    store.goto(stepNum);
  });

  function gotoStep(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) {
      void goto(`/operation-note/${n}`);
    }
  }

  function next() {
    gotoStep(stepNum + 1);
  }
  function prev() {
    gotoStep(stepNum - 1);
  }

  function backToSinglePage() {
    void goto(`/#step-${stepNum}`);
  }

  const StepComponent = $derived(componentsByStep[stepNum] ?? Step1);
</script>

<header class="page-header">
  <div class="page-header-inner">
    <h1>Medical Operation Note — Step {stepNum} of {TOTAL_STEPS}</h1>
    <p class="subtitle">{STEPS[stepNum - 1]?.title ?? ''}</p>
    <Progress label="Form completion" max={100} value={store.percentComplete} />
    <StepList label="Operation Note steps" current={stepNum - 1}>
      {#each store.steps as s (s.number)}
        <StepListItem
          status={s.status}
          current={s.number === stepNum}
          onclick={() => gotoStep(s.number)}
        >
          {s.short}
        </StepListItem>
      {/each}
    </StepList>
  </div>
</header>

<main>
  <Form label={STEPS[stepNum - 1]?.title ?? 'Operation Note step'}>
    <StepComponent />

    <div class="button-group">
      <Button data-variant="secondary" disabled={stepNum <= 1} onclick={prev}>
        Previous
      </Button>
      <Button data-variant="primary" disabled={stepNum >= TOTAL_STEPS} onclick={next}>
        Next
      </Button>
      <Button data-variant="secondary" onclick={backToSinglePage}>
        Back to single-page view
      </Button>
    </div>
  </Form>
</main>
