<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { ImagingClassification } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';

	const a = assessment.data.assessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const modalities = [
		{ value: 'mammography', label: 'Mammography' },
		{ value: 'ultrasound', label: 'Ultrasound' },
		{ value: 'biopsy', label: 'Biopsy' }
	];

	// The five-point imaging classification is numeric (1–5) or null; coerce the
	// select's string value so the grader can compare it strictly against 1..5.
	function setClassification(event: Event) {
		const v = (event.currentTarget as HTMLSelectElement).value;
		a.imagingClassification = v === '' ? null : (Number(v) as ImagingClassification);
	}
</script>

<Fieldset legend="Step 6 of 7 — Assessment result">
	<p class="hint">
		Complete only when the woman is recalled for assessment. The five-point imaging classification
		refines the outcome.
	</p>

	<Field label="Assessment clinic attended?">
		<RadioGroup label="Assessment clinic attended?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="assessment-assessmentPerformed"
						value={opt.value}
						bind:group={a.assessmentPerformed}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if a.assessmentPerformed === 'yes'}
		<Field label="Assessment modalities used">
			<CheckboxGroup label="Assessment modalities used">
				{#each modalities as opt (opt.value)}
					<label>
						<input
							type="checkbox"
							class="checkbox-input"
							name="assessment-assessmentModalities"
							value={opt.value}
							bind:group={a.assessmentModalities}
						/>
						{opt.label}
					</label>
				{/each}
			</CheckboxGroup>
		</Field>

		<Field
			label="Breast imaging classification"
			description="Classes 4–5 are suspicious/malignant and prompt an urgent breast-clinic referral."
			inputId="assessment-imagingClassification"
		>
			<select
				id="assessment-imagingClassification"
				class="select"
				aria-label="Breast imaging classification"
				value={a.imagingClassification === null ? '' : String(a.imagingClassification)}
				onchange={setClassification}
			>
				<option value="">— Select —</option>
				<option value="1">1 — Normal</option>
				<option value="2">2 — Benign</option>
				<option value="3">3 — Indeterminate / probably benign</option>
				<option value="4">4 — Suspicious</option>
				<option value="5">5 — Malignant</option>
			</select>
		</Field>
	{/if}
</Fieldset>
