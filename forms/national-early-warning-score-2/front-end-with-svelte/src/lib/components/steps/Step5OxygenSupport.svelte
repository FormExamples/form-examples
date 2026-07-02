<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/news2-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.oxygenSupport;
	const points = $derived(computeSubscores(assessment.data).oxygen);
</script>

<Fieldset legend="Step 5 of 10 — Air or supplemental oxygen">
	<p class="hint">
		Parameter 3 — any supplemental oxygen scores 2. Device, flow rate, and FiO2 are recorded when
		on oxygen.
	</p>

	<Field label="Is the patient on air or supplemental oxygen?">
		<RadioGroup label="Is the patient on air or supplemental oxygen?">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="oxygenSupport-onOxygen"
					value="air"
					bind:group={s.onOxygen}
				/>
				Air
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="oxygenSupport-onOxygen"
					value="oxygen"
					bind:group={s.onOxygen}
				/>
				Supplemental oxygen
			</label>
		</RadioGroup>
	</Field>

	{#if s.onOxygen === 'oxygen'}
		<Field label="Oxygen delivery device" inputId="oxygenSupport-oxygenDevice">
			<Select
				id="oxygenSupport-oxygenDevice"
				label="Oxygen delivery device"
				bind:value={s.oxygenDevice}
			>
				<option value="">— Select —</option>
				<option value="nasal-cannula">Nasal cannula</option>
				<option value="simple-face-mask">Simple face mask</option>
				<option value="venturi-mask">Venturi mask</option>
				<option value="non-rebreather-mask">Non-rebreather mask</option>
				<option value="humidified">Humidified oxygen</option>
				<option value="cpap">CPAP</option>
				<option value="niv">Non-invasive ventilation</option>
				<option value="tracheostomy">Tracheostomy</option>
				<option value="ventilator">Ventilator</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="Oxygen flow rate (L/min)" inputId="oxygenSupport-oxygenFlowRateLMin">
			<NumberInput
				id="oxygenSupport-oxygenFlowRateLMin"
				label="Oxygen flow rate"
				min={0}
				max={60}
				step={0.5}
				bind:value={s.oxygenFlowRateLMin}
			/>
		</Field>

		<Field
			label="Fraction of inspired oxygen (FiO2 %)"
			inputId="oxygenSupport-inspiredOxygenFractionPercent"
		>
			<NumberInput
				id="oxygenSupport-inspiredOxygenFractionPercent"
				label="Fraction of inspired oxygen"
				min={21}
				max={100}
				step={1}
				bind:value={s.inspiredOxygenFractionPercent}
			/>
		</Field>
	{/if}

	<Field label="Air-or-oxygen subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}"
		>
			{points} points
		</span>
	</Field>
</Fieldset>
