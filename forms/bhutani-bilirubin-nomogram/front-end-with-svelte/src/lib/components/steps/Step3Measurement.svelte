<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeBhutani } from '$lib/engine/bhutani-grader';
	import { riskZoneColor, riskZoneLabel, gestationBandLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const m = assessment.data.measurement;
	const grade = $derived(gradeBhutani(assessment.data));
</script>

<Fieldset legend="Step 3 of 5 — Bilirubin measurement">
	<p class="hint">
		Age at measurement (nomogram x-axis) and total serum bilirubin (y-axis). The risk zone and
		treatment thresholds update live.
	</p>

	<Field
		label="Age at measurement (hours)"
		description="Hours since birth (0–168 h). The nomogram x-axis."
		required
		inputId="measurement-ageHours"
	>
		<NumberInput
			id="measurement-ageHours"
			label="Age at measurement"
			min={0}
			max={168}
			step={0.5}
			required
			bind:value={m.ageHours}
		/>
	</Field>

	<Field
		label="Total serum bilirubin (µmol/L)"
		description="Measured TSB in micromoles per litre. The nomogram y-axis."
		required
		inputId="measurement-totalSerumBilirubinUmolL"
	>
		<NumberInput
			id="measurement-totalSerumBilirubinUmolL"
			label="Total serum bilirubin"
			min={0}
			max={800}
			step={1}
			required
			bind:value={m.totalSerumBilirubinUmolL}
		/>
	</Field>

	<Field label="Measurement method" required inputId="measurement-measurementMethod">
		<Select
			id="measurement-measurementMethod"
			label="Measurement method"
			required
			bind:value={m.measurementMethod}
		>
			<option value="">— Select —</option>
			<option value="serum">Serum bilirubin (SBR)</option>
			<option value="transcutaneous">Transcutaneous (TcB)</option>
		</Select>
	</Field>

	<Field label="Live risk zone and thresholds">
		{#if grade.riskZone === null}
			<span class="text-sm text-base-content/60">Enter age and TSB to see the risk zone.</span>
		{:else}
			<div class="space-y-2">
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskZoneColor(
						grade.riskZone
					)}"
				>
					{riskZoneLabel(grade.riskZone)}
				</span>
				<ul class="text-sm text-base-content/80">
					<li>
						Phototherapy threshold ({gestationBandLabel(grade.gestationBand)}):
						<strong>{grade.phototherapyThreshold} µmol/L</strong> — TSB
						{#if grade.abovePhototherapy}<strong class="text-error">at/above</strong>{:else}<span
								class="text-success">below</span
							>{/if}
					</li>
					<li>
						Exchange threshold ({gestationBandLabel(grade.gestationBand)}):
						<strong>{grade.exchangeThreshold} µmol/L</strong> — TSB
						{#if grade.aboveExchange}<strong class="text-error">at/above</strong>{:else}<span
								class="text-success">below</span
							>{/if}
					</li>
				</ul>
			</div>
		{/if}
	</Field>
</Fieldset>
