<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const l = assessment.data.lightExposure;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Light Exposure Assessment">
	<p class="hint">Daily daylight exposure and access to light therapy.</p>

	<Field label="Daily outdoor daylight (minutes)" inputId="dailyOutdoorMinutes">
		<NumberInput id="dailyOutdoorMinutes" label="Daily outdoor daylight in minutes" min={0} max={1440} bind:value={l.dailyOutdoorMinutes} />
	</Field>

	<Field label="Works predominantly indoors?">
		<RadioGroup label="Works indoors">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="workIndoors" value={opt.value} bind:group={l.workIndoors} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Keeps curtains/blinds closed during daytime?">
		<RadioGroup label="Curtains closed in daytime">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="curtainsClosedDaytime" value={opt.value} bind:group={l.curtainsClosedDaytime} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Regular morning sunrise / bright-light exposure?">
		<RadioGroup label="Sunrise exposure">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="sunriseExposure" value={opt.value} bind:group={l.sunriseExposure} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Currently uses a light therapy box?">
		<RadioGroup label="Uses light therapy box">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="usesLightTherapyBox" value={opt.value} bind:group={l.usesLightTherapyBox} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	{#if l.usesLightTherapyBox === 'yes'}
		<Field label="Light therapy details" inputId="lightTherapyDetails">
			<TextAreaInput id="lightTherapyDetails" label="Light therapy details" rows={2} bind:value={l.lightTherapyDetails} />
		</Field>
	{/if}

	<Field label="Has access to a light therapy box if needed?">
		<RadioGroup label="Light therapy access">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="lightTherapyAccess" value={opt.value} bind:group={l.lightTherapyAccess} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
