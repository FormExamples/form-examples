<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const l = assessment.data.lifestyleFactors;
</script>

<Fieldset legend="Lifestyle Factors">
	<p class="hint">Lifestyle factors relevant to contraceptive choice.</p>

	<Field label="Smoking status" inputId="smokingStatus">
		<Select id="smokingStatus" label="Smoking status" bind:value={l.smokingStatus}>
			<option value="">-- Select --</option>
			<option value="never">Never smoked</option>
			<option value="former">Former smoker</option>
			<option value="current-light">Current smoker (&lt; 15 per day)</option>
			<option value="current-heavy">Current smoker (≥ 15 per day)</option>
		</Select>
	</Field>

	<Field label="Alcohol use" inputId="alcoholUse">
		<Select id="alcoholUse" label="Alcohol use" bind:value={l.alcoholUse}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="occasional">Occasional (1-2 units per week)</option>
			<option value="moderate">Moderate (3-14 units per week)</option>
			<option value="heavy">Heavy (&gt; 14 units per week)</option>
		</Select>
	</Field>

	<Field label="Recreational drug use" inputId="drugUse">
		<Select id="drugUse" label="Recreational drug use" bind:value={l.drugUse}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="cannabis">Cannabis only</option>
			<option value="recreational">Recreational drugs</option>
			<option value="iv-drug-use">IV drug use</option>
		</Select>
	</Field>

	<Field label="Occupation" inputId="occupation">
		<TextInput id="occupation" label="Occupation" placeholder="e.g., nurse, teacher, shift worker..." bind:value={l.occupation} />
	</Field>

	<Field label="Travel plans (relevant for malaria prophylaxis interactions)" inputId="travelPlans">
		<TextAreaInput id="travelPlans" label="Travel plans" rows={3} placeholder="Any upcoming travel to areas requiring specific health considerations..." bind:value={l.travelPlans} />
	</Field>
</Fieldset>
