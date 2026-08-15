<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { TOTAL_STEPS } from '#lib/config/steps.js';

	const s = assessment.data.examination;

	const systems: { field: keyof typeof s; label: string }[] = [
		{ field: 'general', label: 'General appearance' },
		{ field: 'cardiovascular', label: 'Cardiovascular' },
		{ field: 'respiratory', label: 'Respiratory' },
		{ field: 'abdominal', label: 'Abdominal' },
		{ field: 'neurological', label: 'Neurological' },
		{ field: 'musculoskeletal', label: 'Musculoskeletal' },
		{ field: 'skinAndWounds', label: 'Skin and wounds' },
		{ field: 'linesAndDrains', label: 'Lines and drains' },
		{ field: 'other', label: 'Other findings' }
	];
</script>

<Fieldset legend={`Step 5 of ${TOTAL_STEPS} — Examination`}>
	<p class="hint">
		Findings by system. Required for an admission clerking, a consult, and a procedure note;
		recommended otherwise.
	</p>

	{#each systems as sys (sys.field)}
		<Field label={sys.label} inputId={`examination-${sys.field}`}>
			<TextAreaInput
				id={`examination-${sys.field}`}
				label={sys.label}
				rows={2}
				bind:value={s[sys.field]}
			/>
		</Field>
	{/each}
</Fieldset>
