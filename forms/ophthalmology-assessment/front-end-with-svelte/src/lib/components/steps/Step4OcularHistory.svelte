<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const h = assessment.data.ocularHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const eyeOptions = [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'both', label: 'Both' }];
</script>

<Fieldset legend="Ocular History">
	<p class="hint">Previous eye conditions and treatments.</p>

	<Field label="Any previous eye conditions?">
		<RadioGroup label="Previous eye conditions">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevConditions" value={opt.value} bind:group={h.previousEyeConditions} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousEyeConditions === 'yes'}
		<Field label="Please provide details" inputId="prevConditionDetails">
			<TextAreaInput id="prevConditionDetails" label="Previous condition details" rows={2} bind:value={h.previousEyeConditionDetails} />
		</Field>
	{/if}

	<Field label="Any previous eye surgery?">
		<RadioGroup label="Previous eye surgery">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevSurgery" value={opt.value} bind:group={h.previousEyeSurgery} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousEyeSurgery === 'yes'}
		<Field label="Please provide details (type, date, eye)" inputId="prevSurgeryDetails">
			<TextAreaInput id="prevSurgeryDetails" label="Surgery details" rows={2} bind:value={h.previousEyeSurgeryDetails} />
		</Field>
	{/if}

	<Field label="Any previous laser treatment?">
		<RadioGroup label="Laser treatment">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="laserTx" value={opt.value} bind:group={h.laserTreatment} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.laserTreatment === 'yes'}
		<Field label="Please provide details" inputId="laserDetails">
			<TextAreaInput id="laserDetails" label="Laser details" rows={2} bind:value={h.laserTreatmentDetails} />
		</Field>
	{/if}

	<Field label="Any history of eye trauma?">
		<RadioGroup label="Ocular trauma">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="trauma" value={opt.value} bind:group={h.ocularTrauma} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.ocularTrauma === 'yes'}
		<Field label="Please provide details" inputId="traumaDetails">
			<TextAreaInput id="traumaDetails" label="Trauma details" rows={2} bind:value={h.ocularTraumaDetails} />
		</Field>
	{/if}

	<Field label="Do you have amblyopia (lazy eye)?">
		<RadioGroup label="Amblyopia">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="amblyopia" value={opt.value} bind:group={h.amblyopia} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.amblyopia === 'yes'}
		<Field label="Which eye?">
			<RadioGroup label="Amblyopia eye">
				{#each eyeOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="amblyopiaEye" value={opt.value} bind:group={h.amblyopiaEye} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>
