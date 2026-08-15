<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { assess } from '#lib/engine/note-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1NoteIdentification from '#lib/components/steps/Step1NoteIdentification.svelte';
	import Step2PatientAndAdmission from '#lib/components/steps/Step2PatientAndAdmission.svelte';
	import Step3IntervalHistory from '#lib/components/steps/Step3IntervalHistory.svelte';
	import Step4ObservationsAndNews2 from '#lib/components/steps/Step4ObservationsAndNews2.svelte';
	import Step5Examination from '#lib/components/steps/Step5Examination.svelte';
	import Step6Investigations from '#lib/components/steps/Step6Investigations.svelte';
	import Step7Problems from '#lib/components/steps/Step7Problems.svelte';
	import Step8Medications from '#lib/components/steps/Step8Medications.svelte';
	import Step9RiskAssessments from '#lib/components/steps/Step9RiskAssessments.svelte';
	import Step10AssessmentAndImpression from '#lib/components/steps/Step10AssessmentAndImpression.svelte';
	import Step11PlanAndEscalation from '#lib/components/steps/Step11PlanAndEscalation.svelte';
	import Step12CommunicationAndSignOff from '#lib/components/steps/Step12CommunicationAndSignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample note (existing id) or a blank
	// draft (new).
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
			errors = [];
		}
	});

	/**
	 * Required fields plus the cross-field rules from spec §8. The completeness
	 * engine grades what IS recorded; this stops a note being submitted in a
	 * state the schema would reject.
	 */
	function validate(): boolean {
		const d = assessment.data;
		const found: { id: string; message: string }[] = [];

		if (d.header.noteType === '') {
			found.push({ id: 'header-noteType', message: 'Note type is required.' });
		}
		if (d.header.noteAt.trim() === '') {
			found.push({ id: 'header-noteAt', message: 'Date and time of the note is required.' });
		}
		if (d.header.authorName.trim() === '') {
			found.push({ id: 'header-authorName', message: 'Author name is required.' });
		}
		if (d.header.authorGrade === '') {
			found.push({ id: 'header-authorGrade', message: 'Author grade is required.' });
		}

		if (
			d.header.noteAt &&
			d.admission.admissionAt &&
			new Date(d.header.noteAt) < new Date(d.admission.admissionAt)
		) {
			found.push({
				id: 'header-noteAt',
				message: 'The note date and time cannot precede the admission date and time.'
			});
		}

		if (
			d.planning.estimatedDischargeDate &&
			d.header.noteAt &&
			new Date(d.planning.estimatedDischargeDate) < new Date(d.header.noteAt.slice(0, 10))
		) {
			found.push({
				id: 'planning-estimatedDischargeDate',
				message: 'The estimated discharge date cannot precede the date of the note.'
			});
		}

		if (d.signOff.authorOverrideAcuity && d.signOff.authorOverrideReason.trim() === '') {
			found.push({
				id: 'signOff-authorOverrideReason',
				message: 'A reason is required when you override the acuity band.'
			});
		}

		if (d.header.noteType === 'procedure' && d.header.procedurePerformed.trim() === '') {
			found.push({
				id: 'header-procedurePerformed',
				message: 'A procedure note must record the procedure performed.'
			});
		}

		if (d.header.noteType === 'consult' && d.header.consultQuestion.trim() === '') {
			found.push({
				id: 'header-consultQuestion',
				message: 'A consult note must record the consult question.'
			});
		}

		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = assess(assessment.data);
		goto(resolve(`inpatient-clinical-note/inpatient-clinical-notes/${id}/report`));
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New inpatient clinical note' : `Inpatient clinical note ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the twelve sections; both gradings are computed on submit. The completeness engine
		grades the record against the components required for the note type you pick on step 1; the
		acuity engine bands the observations. Neither is a diagnosis.
	</p>
	<Progress label="Note sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Note sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
		{/each}
	</StepList>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id + e.message)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Inpatient clinical note" onsubmit={submit}>
		<Step1NoteIdentification />
		<Step2PatientAndAdmission />
		<Step3IntervalHistory />
		<Step4ObservationsAndNews2 />
		<Step5Examination />
		<Step6Investigations />
		<Step7Problems />
		<Step8Medications />
		<Step9RiskAssessments />
		<Step10AssessmentAndImpression />
		<Step11PlanAndEscalation />
		<Step12CommunicationAndSignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade & view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
