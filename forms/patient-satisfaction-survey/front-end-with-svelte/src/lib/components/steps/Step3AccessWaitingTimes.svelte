<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import LikertField from '#lib/components/ui/LikertField.svelte';

	const d = assessment.data.accessWaitingTimes;
</script>

<Fieldset legend="Access & Waiting Times">
	<p class="hint">How easy was it to access this service?</p>

	<LikertField label="Ease of booking the appointment" name="easeOfBooking" bind:value={d.easeOfBooking} />
	<LikertField label="Waiting time between booking and your appointment" name="waitingTimeForAppointment" bind:value={d.waitingTimeForAppointment} />
	<LikertField label="Waiting time on the day of your appointment" name="waitingTimeOnDay" bind:value={d.waitingTimeOnDay} />
	<LikertField label="Reception / front-desk service" name="receptionService" bind:value={d.receptionService} />
	<LikertField label="Signage and wayfinding around the building" name="signageWayfinding" bind:value={d.signageWayfinding} />
	<LikertField label="Parking and transport" name="parkingTransport" bind:value={d.parkingTransport} />

	<Field label="Approximately how long did you wait on the day? (minutes)" inputId="actualWaitMinutes">
		<NumberInput id="actualWaitMinutes" label="Actual wait (minutes)" min={0} max={1440} bind:value={d.actualWaitMinutes} />
	</Field>
</Fieldset>
