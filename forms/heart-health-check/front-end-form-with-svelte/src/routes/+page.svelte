<script lang="ts">
  import { goto } from '$app/navigation';
  import { assessment } from '$lib/stores/assessment.svelte';
  import { calculateRisk } from '$lib/engine/risk-grader';
  import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
  import { steps as STEPS } from '$lib/config/steps';

  import Form from '$lib/components/ui/Form.svelte';
  import Progress from '$lib/components/ui/Progress.svelte';
  import StepList from '$lib/components/ui/StepList.svelte';
  import StepListItem from '$lib/components/ui/StepListItem.svelte';
  import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';

  import Step1 from '$lib/components/steps/Step1PatientInformation.svelte';
  import Step2 from '$lib/components/steps/Step2DemographicsEthnicity.svelte';
  import Step3 from '$lib/components/steps/Step3BloodPressure.svelte';
  import Step4 from '$lib/components/steps/Step4Cholesterol.svelte';
  import Step5 from '$lib/components/steps/Step5MedicalConditions.svelte';
  import Step6 from '$lib/components/steps/Step6FamilyHistory.svelte';
  import Step7 from '$lib/components/steps/Step7SmokingAlcohol.svelte';
  import Step8 from '$lib/components/steps/Step8PhysicalActivityDiet.svelte';
  import Step9 from '$lib/components/steps/Step9BodyMeasurements.svelte';
  import Step10 from '$lib/components/steps/Step10ReviewCalculate.svelte';

  const stepComponents = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10];

  const title = 'Heart Health Check';
  const subtitle = 'Cardiovascular risk assessment based on QRISK3 methodology.';

  let errorSummaryEl: HTMLDivElement | null = $state(null);

  function focusErrorSummary() {
    queueMicrotask(() => errorSummaryEl?.focus());
  }

  function sectionFilled(sectionKey: string): number {
    const data = assessment.data as unknown as Record<string, Record<string, unknown>>;
    const section = data[sectionKey];
    if (!section) return 0;
    return Object.values(section).filter((v) => v !== '' && v !== null && v !== undefined).length;
  }

  function sectionTotal(sectionKey: string): number {
    const data = assessment.data as unknown as Record<string, Record<string, unknown>>;
    const section = data[sectionKey];
    if (!section) return 0;
    return Object.keys(section).length;
  }

  const percentComplete = $derived.by(() => {
    const totals = STEPS.reduce(
      (acc, s) => {
        acc.filled += sectionFilled(s.section);
        acc.total += sectionTotal(s.section);
        return acc;
      },
      { filled: 0, total: 0 }
    );
    return totals.total === 0 ? 0 : Math.round((totals.filled / totals.total) * 100);
  });

  function stepStatus(n: number): 'waiting' | 'in-progress' | 'finished' | 'error' {
    const cfg = STEPS.find((s) => s.number === n);
    if (!cfg) return 'waiting';
    const filled = sectionFilled(cfg.section);
    const total = sectionTotal(cfg.section);
    if (filled >= total && total > 0) return 'finished';
    if (filled > 0) return 'in-progress';
    return 'waiting';
  }

  function gotoStep(n: number) {
    assessment.goto(n);
    document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (assessment.data.demographicsEthnicity.age === null) {
      e['step-2-age'] = 'Enter the patient age';
    }
    if (!assessment.data.demographicsEthnicity.sex) {
      e['step-2-sex'] = 'Select the patient sex';
    }
    return e;
  }

  function onSubmit() {
    const errors = validate();
    assessment.errors = errors;
    if (Object.keys(errors).length > 0) {
      assessment.errorSummaryHidden = false;
      focusErrorSummary();
      return;
    }
    assessment.errorSummaryHidden = true;
    const risk = calculateRisk(assessment.data);
    const additionalFlags = detectAdditionalFlags(assessment.data);
    assessment.result = {
      riskCategory: risk.riskCategory,
      tenYearRiskPercent: risk.tenYearRiskPercent,
      heartAge: risk.heartAge,
      firedRules: risk.firedRules,
      additionalFlags,
      timestamp: new Date().toISOString()
    };
    assessment.submitted = true;
    assessment.persist();
    goto('/report');
  }

  function onReset() {
    assessment.reset();
  }

  $effect(() => {
    void assessment.data;
    assessment.persist();
  });

  const errorEntries = $derived(Object.entries(assessment.errors));
</script>

<a class="skip-link visually-hidden" href="#form-sections">Skip to questionnaire</a>

<header class="page-header">
  <div class="page-header-inner">
    <h1>{title}</h1>
    <p class="subtitle">{subtitle}</p>

    <Progress label="Form completion" max={100} value={percentComplete} />
    <p class="subtitle" aria-live="polite">{percentComplete}% complete</p>

    <StepList label={`${title} steps`} current={assessment.currentStep - 1}>
      {#each STEPS as s (s.number)}
        <StepListItem
          status={stepStatus(s.number)}
          current={s.number === assessment.currentStep}
          onclick={() => gotoStep(s.number)}
        >
          {s.shortTitle}
        </StepListItem>
      {/each}
    </StepList>
  </div>
</header>

<main>
  <div class="intro">
    <p>
      Calculates 10-year CVD risk, heart age, and identifies modifiable risk
      factors. Complete the 10 sections below, then submit to generate the
      risk report.
    </p>
  </div>

  <Form label={title} onsubmit={onSubmit} onreset={onReset}>
    {#if !assessment.errorSummaryHidden && errorEntries.length > 0}
      <div bind:this={errorSummaryEl} class="error-summary-wrapper">
        <ErrorSummary title="There is a problem">
          <ul>
            {#each errorEntries as [id, message] (id)}
              <li><a href={`#${id}`}>{message}</a></li>
            {/each}
          </ul>
        </ErrorSummary>
      </div>
    {/if}

    <div id="form-sections">
      {#each stepComponents as StepComponent, i (i)}
        <div
          id={`step-${i + 1}`}
          class="step-section"
          onmouseenter={() => assessment.goto(i + 1)}
          onfocusin={() => assessment.goto(i + 1)}
          role="region"
          aria-labelledby={`step-${i + 1}-legend`}
        >
          <StepComponent />
        </div>
      {/each}
    </div>

    <div class="button-group">
      <Button type="submit" data-variant="primary">Submit and view report</Button>
      <Button type="reset" data-variant="secondary">Start over</Button>
    </div>
  </Form>

  <Panel label="Risk report">
    {#if !assessment.submitted}
      <p class="empty-message">Submit the form to see the risk report.</p>
    {:else}
      <p>Report rendered on the <a href="/report">report page</a>.</p>
    {/if}
  </Panel>

  <footer class="page-footer">
    <p>
      The Heart Health Check is a screening tool. All assessments must be
      reviewed by a qualified clinician.
    </p>
  </footer>
</main>
