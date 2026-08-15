<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { featureStateLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.feature4;
	const ctx = assessment.data.context;
	const presentAbsent = [
		{ value: 'present', label: 'Present' },
		{ value: 'absent', label: 'Absent' }
	];
	const isIcu = $derived(ctx.camVariant === 'cam-icu');
	const pillColor = $derived(
		f.alteredConsciousness === 'present'
			? 'bg-error text-error-content border-error'
			: 'bg-base-300 text-base-content border-base-300'
	);
</script>

<Fieldset legend="Step 6 of 8 — Feature 4: altered level of consciousness">
	<p class="hint">
		Positive when the level of consciousness is anything other than alert. For CAM-ICU, record the
		RASS: a patient who is unrousable (RASS -4 or -5) is recorded as unable to assess.
	</p>

	<Field label="Is feature 4 (altered level of consciousness) present?">
		<RadioGroup label="Is feature 4 (altered level of consciousness) present?">
			{#each presentAbsent as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="feature4-alteredConsciousness"
						value={opt.value}
						bind:group={f.alteredConsciousness}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Observed level of consciousness" inputId="feature4-consciousnessLevel">
		<Select
			id="feature4-consciousnessLevel"
			label="Observed level of consciousness"
			bind:value={f.consciousnessLevel}
		>
			<option value="">— Select —</option>
			<option value="alert">Alert</option>
			<option value="vigilant">Vigilant (hyperalert)</option>
			<option value="lethargic">Lethargic (drowsy, easily roused)</option>
			<option value="stupor">Stupor (difficult to rouse)</option>
			<option value="coma">Coma (unrousable)</option>
		</Select>
	</Field>

	{#if isIcu}
		<Field
			label="RASS score (Richmond Agitation-Sedation Scale)"
			description="CAM-ICU only. Range -5 to +4. A RASS of -4 or -5 (unrousable) yields an unable-to-assess result."
			inputId="feature4-rassScore"
		>
			<NumberInput
				id="feature4-rassScore"
				label="RASS score"
				min={-5}
				max={4}
				step={1}
				bind:value={f.rassScore}
			/>
		</Field>
	{/if}

	<Field label="Feature 4 status">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pillColor}">
			{featureStateLabel(f.alteredConsciousness)}
		</span>
	</Field>
</Fieldset>
