<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.activateEmergencyResponse;
	const tri = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
	const items = [
		{ name: 'calledEmergencyNumber', label: 'Activates emergency response (calls 999 / 2222 in hospital).' },
		{ name: 'statedLocationAndCondition', label: 'States location and casualty condition clearly.' },
		{ name: 'designatedAedRetriever', label: 'Designates a specific bystander to retrieve the AED.' },
		{ name: 'usedSpeakerphone', label: 'Uses speakerphone to keep both hands free for care.' }
	] as const;
</script>

<Fieldset legend="Activate Emergency Response">
	<p class="hint">Activation of the emergency response system and AED retrieval.</p>

	{#each items as item (item.name)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each tri as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.name} value={opt.value} bind:group={d[item.name]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
