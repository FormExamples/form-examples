<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.responsivenessBreathing;
	const tri = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
	const items = [
		{ name: 'tappedAndShouted', label: 'Taps shoulders and shouts "Are you OK?" to assess responsiveness.' },
		{ name: 'checkedBreathing', label: 'Checks for absent or abnormal breathing (look at chest).' },
		{ name: 'checkedPulseSimultaneously', label: 'Checks carotid pulse simultaneously with breathing check.' },
		{ name: 'timeWithinTenSeconds', label: 'Completes pulse and breathing check in 10 seconds or less.' }
	] as const;
</script>

<Fieldset legend="Responsiveness & Breathing Check">
	<p class="hint">Assessment of responsiveness, breathing, and pulse within 10 seconds.</p>

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
