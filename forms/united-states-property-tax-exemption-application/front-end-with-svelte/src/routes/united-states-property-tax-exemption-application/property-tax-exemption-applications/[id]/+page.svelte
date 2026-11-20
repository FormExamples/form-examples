<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { gradeApplication } from '#lib/engine/grader.js';
  import { detectFlaggedIssues } from '#lib/engine/flags.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleApplications } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Applicant from '#lib/components/steps/Step1Applicant.svelte';
  import Step2Property from '#lib/components/steps/Step2Property.svelte';
  import Step3Exemptions from '#lib/components/steps/Step3Exemptions.svelte';
  import Step4Income from '#lib/components/steps/Step4Income.svelte';
  import Step5Documents from '#lib/components/steps/Step5Documents.svelte';
  import Step6Filing from '#lib/components/steps/Step6Filing.svelte';
  import Step7Appeal from '#lib/components/steps/Step7Appeal.svelte';
  import Step8Declaration from '#lib/components/steps/Step8Declaration.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample certificate (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleApplications.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.applicant.applicantName.trim() === '') {
      found.push({ id: 'applicant-applicantName', message: 'Applicant name is required.' });
    }
    if (d.property.state.trim() === '') {
      found.push({ id: 'property-state', message: 'State is required.' });
    }
    if (d.property.parcelNumber.trim() === '') {
      found.push({ id: 'property-parcelNumber', message: 'Parcel number is required.' });
    }
    if (d.filing.assessmentYear === null) {
      found.push({ id: 'filing-assessmentYear', message: 'Assessment year is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const grade = gradeApplication(assessment.data);
    assessment.result = {
      eligibilityClass: grade.eligibilityClass,
      filingDeadline: grade.filingDeadline,
      filedLate: grade.filedLate,
      qualifyingExemptions: grade.qualifyingExemptions,
      flaggedIssues: detectFlaggedIssues(assessment.data),
      timestamp: new Date().toISOString()
    };
    goto(
      `/united-states-property-tax-exemption-application/property-tax-exemption-applications/${id}/report`
    );
  }

  function startOver() {
    const seed = sampleApplications.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New Property Tax Exemption Application' : `Application ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the eight sections; the eligibility class, the state filing deadline and flagged issues
    are computed on submit. This is documentation support, not legal or tax advice; the county
    assessor decides.
  </p>
  <Progress label="Application sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Application sections" current={TOTAL_STEPS}>
    {#each steps as step (step.number)}
      <StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
    {/each}
  </StepList>

  {#if errors.length > 0}
    <ErrorSummary title="Please fix the following before submitting" class="mb-6">
      <ul>
        {#each errors as e (e.id)}
          <li><a href={`#${e.id}`}>{e.message}</a></li>
        {/each}
      </ul>
    </ErrorSummary>
  {/if}

  <RestoreBanner show={assessment.hadDraftAtLoad} onDiscard={startOver} />

  <Form label="United States Property Tax Exemption Application" onsubmit={submit}>
    <Step1Applicant />
    <Step2Property />
    <Step3Exemptions />
    <Step4Income />
    <Step5Documents />
    <Step6Filing />
    <Step7Appeal />
    <Step8Declaration />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Check &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
