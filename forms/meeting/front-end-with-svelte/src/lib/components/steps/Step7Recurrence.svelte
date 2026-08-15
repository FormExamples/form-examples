<script lang="ts">
	import { meeting } from '#lib/stores/meeting.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const r = meeting.data.recurrence;
</script>

<Fieldset legend="Recurrence">
	<p class="hint">Optional RFC 5545 RRULE-style recurrence. Open-ended series are flagged.</p>

	<Field label="Frequency" inputId="recFrequency">
		<Select id="recFrequency" label="Frequency" bind:value={r.frequency}>
			<option value="none">None (one-off)</option>
			<option value="daily">Daily</option>
			<option value="weekday">Every weekday</option>
			<option value="weekly">Weekly</option>
			<option value="monthly">Monthly</option>
			<option value="quarterly">Quarterly</option>
			<option value="yearly">Yearly</option>
		</Select>
	</Field>

	{#if r.frequency !== 'none'}
		<Field label="Interval (every n)" inputId="recInterval">
			<input id="recInterval" class="number-input" type="number" min="1" aria-label="Interval count" bind:value={r.intervalCount} />
		</Field>
		<Field label="By day of week" inputId="recByDayOfWeek">
			<TextInput id="recByDayOfWeek" label="By day of week" placeholder="e.g. MO,WE,FR" bind:value={r.byDayOfWeek} />
		</Field>
		<Field label="By day of month" inputId="recByDayOfMonth">
			<TextInput id="recByDayOfMonth" label="By day of month" placeholder="e.g. 1 or 15" bind:value={r.byDayOfMonth} />
		</Field>
		<Field label="By set position" inputId="recBySetPosition">
			<TextInput id="recBySetPosition" label="By set position" placeholder="e.g. 1 (first), -1 (last)" bind:value={r.bySetPosition} />
		</Field>
		<Field label="By month of year" inputId="recByMonthOfYear">
			<TextInput id="recByMonthOfYear" label="By month of year" placeholder="e.g. 1 (January)" bind:value={r.byMonthOfYear} />
		</Field>
		<Field label="Series count" inputId="recSeriesCount" description="End after this many occurrences.">
			<input id="recSeriesCount" class="number-input" type="number" min="1" aria-label="Series count" bind:value={r.seriesCount} />
		</Field>
		<Field label="Series until" inputId="recSeriesUntil" description="Or end on this date.">
			<input id="recSeriesUntil" class="date-input" type="date" aria-label="Series until" bind:value={r.seriesUntil} />
		</Field>
	{/if}
</Fieldset>
