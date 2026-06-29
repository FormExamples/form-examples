<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.clinicalImpressionReferral;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Clinical Impression & Referral">
	<p class="hint">Provisional diagnosis, hearing-aid candidacy, vestibular rehab, and onward referral plan.</p>

	<Field label="Provisional diagnosis" inputId="provisionalDiagnosis">
		<TextAreaInput id="provisionalDiagnosis" label="Provisional diagnosis" rows={3} placeholder="e.g. Right SSNHL; BPPV (posterior canal); Meniere disease…" bind:value={c.provisionalDiagnosis} />
	</Field>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Hearing-aid candidate?" inputId="hearingAidCandidate">
			<Select id="hearingAidCandidate" label="Hearing-aid candidate?" bind:value={c.hearingAidCandidate}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="already-fitted">Already fitted</option>
			</Select>
		</Field>
		<Field label="Vestibular rehabilitation indicated?">
			<RadioGroup label="Vestibular rehabilitation indicated?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="vestibularRehabIndicated" value={opt.value} bind:group={c.vestibularRehabIndicated} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="ENT referral?">
			<RadioGroup label="ENT referral?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="entReferral" value={opt.value} bind:group={c.ent_referral} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Neurology referral?">
			<RadioGroup label="Neurology referral?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="neurologyReferral" value={opt.value} bind:group={c.neurologyReferral} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Imaging requested" inputId="imagingRequested">
			<Select id="imagingRequested" label="Imaging requested" bind:value={c.imagingRequested}>
				<option value="">-- Select --</option>
				<option value="mri">MRI internal auditory meatus / IAM</option>
				<option value="ct">CT temporal bone</option>
				<option value="none">None</option>
			</Select>
		</Field>
		<Field label="Follow-up (weeks)" inputId="followUpWeeks">
			<NumberInput id="followUpWeeks" label="Follow-up in weeks" min={0} max={156} bind:value={c.followUpWeeks} />
		</Field>
	</div>

	<Field label="Additional notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional notes" rows={3} placeholder="Anything else for the clinical record…" bind:value={c.additionalNotes} />
	</Field>
</Fieldset>
