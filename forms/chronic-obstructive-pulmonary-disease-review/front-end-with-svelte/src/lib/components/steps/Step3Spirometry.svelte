<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const s = assessment.data.spirometry;
</script>

<Fieldset legend="Step 3 of 11 — Spirometry">
	<p class="hint">
		Post-bronchodilator spirometry. FEV₁ % predicted determines the GOLD airflow grade.
	</p>

	<Field label="Post-bronchodilator FEV₁ (litres)" inputId="spirometry-fev1Litres">
		<NumberInput
			id="spirometry-fev1Litres"
			label="Post-bronchodilator FEV₁ (litres)"
			min={0}
			max={8}
			step={0.01}
			bind:value={s.fev1Litres}
		/>
	</Field>

	<Field
		label="FEV₁ % predicted"
		inputId="spirometry-fev1PercentPredicted"
		description="GOLD grade: ≥ 80 → 1 (mild), 50–79 → 2 (moderate), 30–49 → 3 (severe), &lt; 30 → 4 (very severe)."
	>
		<NumberInput
			id="spirometry-fev1PercentPredicted"
			label="FEV₁ % predicted"
			min={0}
			max={150}
			step={0.1}
			bind:value={s.fev1PercentPredicted}
		/>
	</Field>

	<Field label="FVC (litres)" inputId="spirometry-fvcLitres">
		<NumberInput
			id="spirometry-fvcLitres"
			label="FVC (litres)"
			min={0}
			max={10}
			step={0.01}
			bind:value={s.fvcLitres}
		/>
	</Field>

	<Field
		label="FEV₁/FVC ratio"
		inputId="spirometry-fev1FvcRatio"
		description="Airflow obstruction is confirmed when &lt; 0.70."
	>
		<NumberInput
			id="spirometry-fev1FvcRatio"
			label="FEV₁/FVC ratio"
			min={0}
			max={1}
			step={0.001}
			bind:value={s.fev1FvcRatio}
		/>
	</Field>

	<Field label="Date of spirometry" inputId="spirometry-spirometryDate">
		<TextInput
			id="spirometry-spirometryDate"
			label="Date of spirometry"
			type="date"
			class="date-input"
			bind:value={s.spirometryDate}
		/>
	</Field>
</Fieldset>
