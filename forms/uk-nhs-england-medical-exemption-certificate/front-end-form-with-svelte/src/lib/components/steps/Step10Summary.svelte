<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { conditionLabel } from '$lib/engine/utils';
</script>

<SectionCard
	title="Summary, eligibility result &amp; sign-off"
	description="Press 'Evaluate eligibility' below to run the FP92A grading engine and display the computed outcome, fired rules, and advisory flags."
>
	{#if !application.result}
		<p class="text-sm text-gray-500">
			The evaluation has not been run yet. Use the button below to compute eligibility.
		</p>
	{:else}
		{@const r = application.result}
		<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
			<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
				<div class="text-gray-500">Outcome</div>
				<div class="mt-1 font-medium">
					{#if r.outcome === 'eligible'}
						<span class="text-green-700">Eligible</span>
					{:else if r.outcome === 'ineligible'}
						<span class="text-red-700">Ineligible</span>
					{:else if r.outcome === 'requires-clarification'}
						<span class="text-amber-700">Requires clarification</span>
					{:else}
						<span class="text-gray-700">Not yet determined</span>
					{/if}
				</div>
			</div>

			<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
				<div class="text-gray-500">Recommended next action</div>
				<div class="mt-1 font-medium">
					{#if r.redirectTo === 'FW8'}
						Apply for the FW8 maternity exemption
					{:else if r.redirectTo === 'age-exemption'}
						Use age-based exemption — no FP92A needed
					{:else if r.outcome === 'eligible'}
						Print, sign in ink, and post the FP92A to NHSBSA Bridge House
					{:else if r.outcome === 'requires-clarification'}
						Resolve flags and re-evaluate
					{:else}
						Review the fired rules and flags
					{/if}
				</div>
			</div>

			{#if r.validFrom}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
					<div class="text-gray-500">Valid from</div>
					<div class="mt-1 font-medium">{r.validFrom}</div>
				</div>
			{/if}
			{#if r.validUntil}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
					<div class="text-gray-500">Valid until</div>
					<div class="mt-1 font-medium">{r.validUntil}</div>
				</div>
			{/if}
		</div>

		{#if r.eligibleConditions.length > 0}
			<h3 class="mb-2 text-sm font-semibold text-gray-900">
				Eligible conditions ({r.eligibleConditions.length})
			</h3>
			<ul class="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-800">
				{#each r.eligibleConditions as code (code)}
					<li>{conditionLabel(code)}</li>
				{/each}
			</ul>
		{/if}

		{#if r.firedRules.length > 0}
			<h3 class="mb-2 text-sm font-semibold text-gray-900">
				Fired rules ({r.firedRules.length})
			</h3>
			<ul class="mb-4 space-y-2">
				{#each r.firedRules as fr (fr.id)}
					<li class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
						<div class="mb-1 flex items-center gap-2">
							<Badge priority={fr.priority} />
							<span class="text-xs text-gray-500">{fr.id} · {fr.category}</span>
						</div>
						<div class="text-gray-800">{fr.message}</div>
					</li>
				{/each}
			</ul>
		{/if}

		{#if r.additionalFlags.length > 0}
			<h3 class="mb-2 text-sm font-semibold text-gray-900">
				Additional flags ({r.additionalFlags.length})
			</h3>
			<ul class="space-y-2">
				{#each r.additionalFlags as f (f.id)}
					<li class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
						<div class="mb-1 flex items-center gap-2">
							<Badge priority={f.priority} />
							<span class="text-xs text-gray-500">{f.id} · {f.category}</span>
						</div>
						<div class="text-gray-800">{f.message}</div>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</SectionCard>
