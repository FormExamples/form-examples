<script lang="ts">
	import { store } from '#lib/stores/fitnote.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import YesNo from '#lib/components/ui/YesNo.svelte';

	const d = store.data;
</script>

<Fieldset legend="Follow-up">
	<p class="hint">Whether the clinician intends to reassess the patient.</p>

	<div class="field-grid">
		<Field label="Will assess again at end of period?">
			<YesNo
				label="Will assess again at end of period?"
				name="willAssessAgain"
				bind:value={d.willAssessAgain}
			/>
		</Field>
		<Field label="Planned review date" inputId="planned-review-date">
			<DateInput
				id="planned-review-date"
				label="Planned review date"
				bind:value={d.plannedReviewDate}
			/>
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
