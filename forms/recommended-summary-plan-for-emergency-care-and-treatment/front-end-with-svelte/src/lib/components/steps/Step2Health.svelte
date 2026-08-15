<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const h = assessment.data.health;
</script>

<Fieldset legend="Step 2 of 9 — Summary of relevant health">
	<p class="hint">A brief clinical picture that gives context to the recommendations.</p>

	<Field
		label="Clinical summary"
		description="A short summary of the person’s current health and situation."
		required
		inputId="health-healthSummary"
	>
		<TextAreaInput
			id="health-healthSummary"
			label="Clinical summary"
			rows={3}
			placeholder="e.g. Advanced heart failure, recurrent admissions, frailty."
			required
			bind:value={h.healthSummary}
		/>
	</Field>

	<Field label="Relevant diagnoses" inputId="health-diagnoses">
		<TextAreaInput
			id="health-diagnoses"
			label="Relevant diagnoses"
			rows={3}
			placeholder="Key diagnoses relevant to emergency care"
			bind:value={h.diagnoses}
		/>
	</Field>

	<Field
		label="Existing documents"
		description="Advance Decision to Refuse Treatment, Lasting Power of Attorney, organ-donation wishes, etc."
		inputId="health-existingDocuments"
	>
		<TextAreaInput
			id="health-existingDocuments"
			label="Existing documents"
			rows={3}
			placeholder="e.g. ADRT held; welfare LPA registered."
			bind:value={h.existingDocuments}
		/>
	</Field>
</Fieldset>
