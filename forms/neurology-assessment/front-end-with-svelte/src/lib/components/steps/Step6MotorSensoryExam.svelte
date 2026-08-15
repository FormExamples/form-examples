<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.motorSensoryExam;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	const strengthOptions = [
		{ value: '0', label: '0 - No contraction' },
		{ value: '1', label: '1 - Flicker/trace' },
		{ value: '2', label: '2 - Active movement, gravity eliminated' },
		{ value: '3', label: '3 - Active movement against gravity' },
		{ value: '4', label: '4 - Active movement against resistance' },
		{ value: '5', label: '5 - Normal strength' }
	];
</script>

<Fieldset legend="Motor and Sensory Examination">
	<p class="hint">Strength, tone, reflexes, sensation, coordination, and gait.</p>

	<div class="field-grid">
		<Field label="Upper limb - Left" inputId="strengthUL">
			<Select id="strengthUL" label="Upper limb left" bind:value={m.strengthUpperLeft}>
				<option value="">-- Select --</option>
				{#each strengthOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Upper limb - Right" inputId="strengthUR">
			<Select id="strengthUR" label="Upper limb right" bind:value={m.strengthUpperRight}>
				<option value="">-- Select --</option>
				{#each strengthOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Lower limb - Left" inputId="strengthLL">
			<Select id="strengthLL" label="Lower limb left" bind:value={m.strengthLowerLeft}>
				<option value="">-- Select --</option>
				{#each strengthOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Lower limb - Right" inputId="strengthLR">
			<Select id="strengthLR" label="Lower limb right" bind:value={m.strengthLowerRight}>
				<option value="">-- Select --</option>
				{#each strengthOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="Tone" inputId="tone">
		<Select id="tone" label="Tone" bind:value={m.tone}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="increased">Increased (spasticity/rigidity)</option>
			<option value="decreased">Decreased (flaccid)</option>
			<option value="rigid">Rigid (lead-pipe/cogwheel)</option>
		</Select>
	</Field>

	<Field label="Reflexes" inputId="reflexes">
		<Select id="reflexes" label="Reflexes" bind:value={m.reflexes}>
			<option value="">-- Select --</option>
			<option value="0">0 - Absent</option>
			<option value="1">1 - Diminished</option>
			<option value="2">2 - Normal</option>
			<option value="3">3 - Brisk</option>
			<option value="4">4 - Clonus</option>
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Plantar response - Left" inputId="plantarLeft">
			<Select id="plantarLeft" label="Plantar left" bind:value={m.plantarResponseLeft}>
				<option value="">-- Select --</option>
				<option value="flexor">Flexor (normal)</option>
				<option value="extensor">Extensor (Babinski positive)</option>
			</Select>
		</Field>
		<Field label="Plantar response - Right" inputId="plantarRight">
			<Select id="plantarRight" label="Plantar right" bind:value={m.plantarResponseRight}>
				<option value="">-- Select --</option>
				<option value="flexor">Flexor (normal)</option>
				<option value="extensor">Extensor (Babinski positive)</option>
			</Select>
		</Field>
	</div>

	<Field label="Sensation" inputId="sensation">
		<Select id="sensation" label="Sensation" bind:value={m.sensation}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="decreased">Decreased</option>
			<option value="absent">Absent</option>
			<option value="paraesthesia">Paraesthesia</option>
		</Select>
	</Field>
	{#if m.sensation !== 'normal' && m.sensation !== ''}
		<Field label="Sensory details (distribution)" inputId="sensationDetails">
			<TextAreaInput id="sensationDetails" label="Sensation details" rows={2} bind:value={m.sensationDetails} />
		</Field>
	{/if}

	<Field label="Coordination normal?">
		<RadioGroup label="Coordination">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="coordination" value={opt.value} bind:group={m.coordination} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.coordination === 'no'}
		<Field label="Coordination details" inputId="coordDetails">
			<TextAreaInput id="coordDetails" label="Coordination details" rows={2} placeholder="e.g., finger-nose, heel-shin abnormalities" bind:value={m.coordinationDetails} />
		</Field>
	{/if}

	<Field label="Gait" inputId="gait">
		<Select id="gait" label="Gait" bind:value={m.gait}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="ataxic">Ataxic</option>
			<option value="spastic">Spastic</option>
			<option value="steppage">Steppage</option>
			<option value="antalgic">Antalgic</option>
			<option value="unable">Unable to walk</option>
		</Select>
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
