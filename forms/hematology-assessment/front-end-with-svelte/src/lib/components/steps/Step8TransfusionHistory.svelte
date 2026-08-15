<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const d = assessment.data.transfusionHistory;
</script>

<Fieldset legend="Transfusion History">
	<p class="hint">Document the patient's transfusion history and blood group information</p>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Previous Transfusions" inputId="previousTransfusions"><Select id="previousTransfusions" label="Previous Transfusions" bind:value={d.previousTransfusions}><option value="">-- Select --</option>{#each [
				{ value: 'none', label: 'None' },
				{ value: '1to5', label: '1-5 transfusions' },
				{ value: '6to20', label: '6-20 transfusions' },
				{ value: 'moreThan20', label: 'More than 20 transfusions' },
				{ value: 'chronicDependent', label: 'Chronic transfusion-dependent' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
		<Field label="Transfusion Reactions" inputId="transfusionReactions"><Select id="transfusionReactions" label="Transfusion Reactions" bind:value={d.transfusionReactions}><option value="">-- Select --</option>{#each [
				{ value: 'none', label: 'None' },
				{ value: 'febrile', label: 'Febrile non-hemolytic' },
				{ value: 'allergic', label: 'Allergic' },
				{ value: 'hemolytic', label: 'Hemolytic' },
				{ value: 'trali', label: 'TRALI' },
				{ value: 'other', label: 'Other' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Blood Group & Type" inputId="bloodGroupType"><Select id="bloodGroupType" label="Blood Group & Type" bind:value={d.bloodGroupType}><option value="">-- Select --</option>{#each [
				{ value: 'aPositive', label: 'A Positive' },
				{ value: 'aNegative', label: 'A Negative' },
				{ value: 'bPositive', label: 'B Positive' },
				{ value: 'bNegative', label: 'B Negative' },
				{ value: 'abPositive', label: 'AB Positive' },
				{ value: 'abNegative', label: 'AB Negative' },
				{ value: 'oPositive', label: 'O Positive' },
				{ value: 'oNegative', label: 'O Negative' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
		<Field label="Antibody Screen" inputId="antibodyScreen"><Select id="antibodyScreen" label="Antibody Screen" bind:value={d.antibodyScreen}><option value="">-- Select --</option>{#each [
				{ value: 'negative', label: 'Negative' },
				{ value: 'positive', label: 'Positive' },
				{ value: 'notPerformed', label: 'Not Performed' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	</div>

	<Field label="Crossmatch Results" inputId="crossmatchResults"><TextAreaInput id="crossmatchResults" label="Crossmatch Results" rows={2} placeholder="e.g. Compatible, no irregularities" bind:value={d.crossmatchResults} /></Field>
</Fieldset>
