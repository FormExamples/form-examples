<script lang="ts">
	import { sampleReports } from '$lib/data/sample-reports';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		resultClassificationLabel,
		resultClassificationColor,
		abnormalitySeverityLabel,
		abnormalitySeverityColor,
		followUpUrgencyLabel,
		followUpUrgencyColor,
		bodyRegionLabel,
		reportStatusLabel
	} from '$lib/engine/utils';

	let classificationFilter = $state('');
	let urgencyFilter = $state('');

	const rows = $derived(
		sampleReports.filter(
			(r) =>
				(classificationFilter === '' || r.resultClassification === classificationFilter) &&
				(urgencyFilter === '' || r.followUpUrgency === urgencyFilter)
		)
	);
</script>

<main class="mx-auto max-w-5xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Graded angiography reports</h1>
			<p class="mt-1 text-sm text-gray-600">
				Four-axis interpretation grades for completed angiography reports.
			</p>
		</div>
		<a href="/report" class="button" data-variant="primary">New report</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-gray-700">Classification</span>
			<select class="select inline-block w-auto" bind:value={classificationFilter}>
				<option value="">All</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
				<option value="critical">Critical</option>
				<option value="inconclusive">Inconclusive</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-gray-700">Follow-up urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="recommended">Recommended</option>
				<option value="urgent">Urgent</option>
				<option value="critical-alert">Critical alert</option>
			</select>
		</label>
	</div>

	<div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-200 bg-gray-50 text-gray-600">
				<tr>
					<th class="px-4 py-3 font-semibold">Report</th>
					<th class="px-4 py-3 font-semibold">Patient</th>
					<th class="px-4 py-3 font-semibold">Region</th>
					<th class="px-4 py-3 font-semibold">Status</th>
					<th class="px-4 py-3 font-semibold">Reported</th>
					<th class="px-4 py-3 font-semibold">Classification</th>
					<th class="px-4 py-3 font-semibold">Severity</th>
					<th class="px-4 py-3 font-semibold">Urgency</th>
					<th class="px-4 py-3 font-semibold">Complete</th>
					<th class="px-4 py-3 font-semibold">Flags</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as r (r.id)}
					<tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
						<td class="px-4 py-3 font-mono text-xs text-gray-500">{r.id}</td>
						<td class="px-4 py-3 font-medium text-gray-900">{r.patientName}</td>
						<td class="px-4 py-3 text-gray-700">{bodyRegionLabel(r.bodyRegion)}</td>
						<td class="px-4 py-3 text-gray-700">{reportStatusLabel(r.reportStatus)}</td>
						<td class="px-4 py-3 text-gray-700">{r.reportedDate}</td>
						<td class="px-4 py-3">
							<Badge
								label={resultClassificationLabel(r.resultClassification)}
								color={resultClassificationColor(r.resultClassification)}
							/>
						</td>
						<td class="px-4 py-3">
							<Badge
								label={abnormalitySeverityLabel(r.abnormalitySeverity)}
								color={abnormalitySeverityColor(r.abnormalitySeverity)}
							/>
						</td>
						<td class="px-4 py-3">
							<Badge
								label={followUpUrgencyLabel(r.followUpUrgency)}
								color={followUpUrgencyColor(r.followUpUrgency)}
							/>
						</td>
						<td class="px-4 py-3 text-gray-700">{r.reportCompletenessPercent}%</td>
						<td class="px-4 py-3 text-gray-700">{r.flagCount}</td>
					</tr>
				{:else}
					<tr>
						<td class="px-4 py-6 text-center text-gray-500" colspan="10">
							No reports match the current filters.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
