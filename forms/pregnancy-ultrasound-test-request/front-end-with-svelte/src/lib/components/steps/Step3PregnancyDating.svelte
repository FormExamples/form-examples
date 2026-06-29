<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="3. Pregnancy Dating">
	<p class="hint">LMP, EDD, and current gestational age — drives the window-fit axis.</p>

	<Field label="Last menstrual period (LMP)" inputId="lastMenstrualPeriodDate">
		<DateInput
			id="lastMenstrualPeriodDate"
			label="Last menstrual period (LMP)"
			bind:value={d.dating.lastMenstrualPeriodDate}
		/>
	</Field>

	<Field label="LMP reliability" inputId="lastMenstrualPeriodReliability">
		<Select
			id="lastMenstrualPeriodReliability"
			label="LMP reliability"
			bind:value={d.dating.lastMenstrualPeriodReliability}
		>
			<option value="">Select…</option>
			<option value="reliable">Reliable</option>
			<option value="uncertain">Uncertain</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Estimated due date (EDD)" inputId="estimatedDueDate">
		<DateInput
			id="estimatedDueDate"
			label="Estimated due date (EDD)"
			bind:value={d.dating.estimatedDueDate}
		/>
	</Field>

	<Field label="EDD derivation method" inputId="estimatedDueDateMethod">
		<Select
			id="estimatedDueDateMethod"
			label="EDD derivation method"
			bind:value={d.dating.estimatedDueDateMethod}
		>
			<option value="">Select…</option>
			<option value="lmp">LMP</option>
			<option value="ultrasound">Ultrasound</option>
			<option value="ivf">IVF</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Gestational age (weeks)" inputId="gestationalAgeWeeks" description="weeks">
		<NumberInput
			id="gestationalAgeWeeks"
			label="Gestational age (weeks)"
			min={0}
			max={45}
			bind:value={d.dating.gestationalAgeWeeks}
		/>
	</Field>

	<Field label="Gestational age (days)" inputId="gestationalAgeDays" description="days">
		<NumberInput
			id="gestationalAgeDays"
			label="Gestational age (days)"
			min={0}
			max={6}
			bind:value={d.dating.gestationalAgeDays}
		/>
	</Field>
</Fieldset>
