<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.airwayRescueBreaths;
	const tri = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
	const items = [
		{ name: 'headTiltChinLift', label: 'Opens airway with head tilt-chin lift (or jaw thrust if trauma).', critical: false },
		{ name: 'effectiveSeal', label: 'Achieves an effective seal on mask or pocket-mask device.', critical: false },
		{ name: 'visibleChestRise', label: 'Each ventilation produces visible chest rise (effective breath).', critical: true },
		{ name: 'oneSecondPerBreath', label: 'Delivers each breath over approximately 1 second.', critical: false },
		{ name: 'ratio30to2', label: 'Maintains a 30:2 compression-to-ventilation ratio.', critical: false },
		{ name: 'avoidedExcessiveVentilation', label: 'Avoids excessive ventilation (volume and rate).', critical: false }
	] as const;
</script>

<Fieldset legend="Airway & Rescue Breaths">
	<p class="hint">Airway opening and effective ventilation with visible chest rise.</p>

	{#each items as item (item.name)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each tri as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.name} value={opt.value} bind:group={d[item.name]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
			{#if item.critical}
				<p class="hint critical-hint">Critical action — any failure forces an overall Fail.</p>
			{/if}
		</Field>
	{/each}
</Fieldset>

<style>
	.critical-hint {
		font-weight: 600;
	}
</style>
