<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const s = assessment.data.breastCervicalScreening;
</script>

<Fieldset legend="Breast & Cervical Screening">
	<p class="hint">Screening history relevant to contraceptive counselling.</p>

	<Field label="Date of last breast screening" inputId="lastBreastScreening">
		<DateInput id="lastBreastScreening" label="Date of last breast screening" bind:value={s.lastBreastScreening} />
	</Field>

	<Field label="Date of last cervical screening (smear test)" inputId="lastCervicalScreening">
		<DateInput id="lastCervicalScreening" label="Date of last cervical screening" bind:value={s.lastCervicalScreening} />
	</Field>

	<Field label="HPV vaccination status" inputId="hpvVaccination">
		<Select id="hpvVaccination" label="HPV vaccination status" bind:value={s.hpvVaccination}>
			<option value="">-- Select --</option>
			<option value="completed">Completed (all doses)</option>
			<option value="partial">Partially vaccinated</option>
			<option value="none">Not vaccinated</option>
			<option value="unsure">Unsure</option>
		</Select>
	</Field>
</Fieldset>
