<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { severeByAverages } from '#lib/engine/utils.js';

	const d = resultStore.data;

	const severe = $derived(severeByAverages(d));
</script>

<Fieldset legend="4. Average Blood Pressures">
	<p class="hint">
		The daytime, nighttime, and 24-hour averaged blood pressures (mmHg). Daytime average >= 135/85
		confirms hypertension; an ABPM average >= 150/95 is severe.
	</p>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<Field label="Daytime average systolic (mmHg)" inputId="daytimeAverageSystolic">
			<NumberInput
				id="daytimeAverageSystolic"
				label="Daytime average systolic (mmHg)"
				min={50}
				max={300}
				step={0.1}
				bind:value={d.daytimeAverageSystolic}
			/>
		</Field>
		<Field label="Daytime average diastolic (mmHg)" inputId="daytimeAverageDiastolic">
			<NumberInput
				id="daytimeAverageDiastolic"
				label="Daytime average diastolic (mmHg)"
				min={20}
				max={200}
				step={0.1}
				bind:value={d.daytimeAverageDiastolic}
			/>
		</Field>

		<Field label="Nighttime average systolic (mmHg)" inputId="nighttimeAverageSystolic">
			<NumberInput
				id="nighttimeAverageSystolic"
				label="Nighttime average systolic (mmHg)"
				min={50}
				max={300}
				step={0.1}
				bind:value={d.nighttimeAverageSystolic}
			/>
		</Field>
		<Field label="Nighttime average diastolic (mmHg)" inputId="nighttimeAverageDiastolic">
			<NumberInput
				id="nighttimeAverageDiastolic"
				label="Nighttime average diastolic (mmHg)"
				min={20}
				max={200}
				step={0.1}
				bind:value={d.nighttimeAverageDiastolic}
			/>
		</Field>

		<Field label="24-hour average systolic (mmHg)" inputId="twentyFourHourAverageSystolic">
			<NumberInput
				id="twentyFourHourAverageSystolic"
				label="24-hour average systolic (mmHg)"
				min={50}
				max={300}
				step={0.1}
				bind:value={d.twentyFourHourAverageSystolic}
			/>
		</Field>
		<Field label="24-hour average diastolic (mmHg)" inputId="twentyFourHourAverageDiastolic">
			<NumberInput
				id="twentyFourHourAverageDiastolic"
				label="24-hour average diastolic (mmHg)"
				min={20}
				max={200}
				step={0.1}
				bind:value={d.twentyFourHourAverageDiastolic}
			/>
		</Field>
	</div>

	{#if severe}
		<Alert type="error" heading="Severe hypertension">
			<p>
				An average at or above 150/95 mmHg (equivalent to clinic >= 180/120) auto-escalates the
				follow-up urgency to a critical alert. Arrange same-day specialist review and communicate
				the result to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
