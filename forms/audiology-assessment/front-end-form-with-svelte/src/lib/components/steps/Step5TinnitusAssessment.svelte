<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.tinnitusAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const earOptions = [
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'both', label: 'Both' }
	];

	const severityOptions = [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];

	const impactOptions = [
		{ value: 'mild', label: 'Mild — barely noticeable' },
		{ value: 'moderate', label: 'Moderate — noticeable but manageable' },
		{ value: 'severe', label: 'Severe — significantly affects daily activities' }
	];
</script>

<Fieldset legend="Tinnitus Assessment">
	<p class="hint">Ringing, buzzing, or other sounds in the ears.</p>

	<Field label="Do you experience tinnitus?">
		<RadioGroup label="Tinnitus presence">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tinnitusPresence" value={opt.value} bind:group={t.presence} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.presence === 'yes'}
		<Field label="Which ear is affected?">
			<RadioGroup label="Affected ear">
				{#each earOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="tinnitusEar" value={opt.value} bind:group={t.affectedEar} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="What does the tinnitus sound like?" inputId="tinnitusCharacter">
			<Select id="tinnitusCharacter" label="Tinnitus character" bind:value={t.character}>
				<option value="">— Select —</option>
				<option value="ringing">Ringing</option>
				<option value="buzzing">Buzzing</option>
				<option value="hissing">Hissing</option>
				<option value="pulsatile">Pulsatile (heartbeat-like)</option>
				<option value="clicking">Clicking</option>
				<option value="roaring">Roaring</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="How severe is the tinnitus?">
			<RadioGroup label="Tinnitus severity">
				{#each severityOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="tinnitusSeverity" value={opt.value} bind:group={t.severity} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="How long have you had tinnitus?" inputId="tinnitusDuration">
			<TextInput id="tinnitusDuration" label="Tinnitus duration" bind:value={t.duration} />
		</Field>

		<Field label="How much does tinnitus impact your daily life?">
			<RadioGroup label="Tinnitus impact">
				{#each impactOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="tinnitusImpact" value={opt.value} bind:group={t.impactOnDailyLife} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Tinnitus Handicap Inventory (THI) Score" inputId="thiScore" description="0–100">
			<NumberInput id="thiScore" label="THI Score" min={0} max={100} bind:value={t.tinnitusHandicapInventoryScore} />
		</Field>
	{/if}
</Fieldset>
