<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { application } from '$lib/stores/application.svelte';
	import { conditionLabel } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'united-kingdom-nhs-england-medical-exemption-certificates';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(application.data);
	const result = $derived(application.result);

	$effect(() => {
		if (!application.result) {
			goto(`/${plural}/${id}`);
		}
	});

	const outcomeBanner: Record<string, string> = {
		eligible: 'bg-success text-success-content border-success',
		ineligible: 'bg-error text-error-content border-error',
		'requires-clarification': 'bg-warning text-warning-content border-warning',
		'': 'bg-base-300 text-base-content border-base-300'
	};

	const outcomeLabel: Record<string, string> = {
		eligible: 'Eligible',
		ineligible: 'Ineligible',
		'requires-clarification': 'Requires clarification',
		'': 'Not yet determined'
	};

	function nextAction(r: NonNullable<typeof result>): string {
		if (r.redirectTo === 'FW8') return 'Apply for the FW8 maternity exemption';
		if (r.redirectTo === 'age-exemption') return 'Use age-based exemption — no FP92A needed';
		if (r.outcome === 'eligible') return 'Print, sign in ink, and post the FP92A to NHSBSA Bridge House';
		if (r.outcome === 'requires-clarification') return 'Resolve flags and re-evaluate';
		return 'Review the fired rules and flags';
	}

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: application.data, result: application.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `fp92a-${data.patient.surname || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">FP92A eligibility report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeBanner[result.outcome]}">
			<div class="text-3xl font-bold">{outcomeLabel[result.outcome]}</div>
			<div class="mt-2 text-sm">{nextAction(result)}</div>
			<div class="mt-2 flex justify-center gap-6 text-sm opacity-90">
				{#if result.validFrom}<span>Valid from {result.validFrom}</span>{/if}
				{#if result.validUntil}<span>Valid until {result.validUntil}</span>{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Eligible conditions -->
		{#if result.eligibleConditions.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">
					Eligible conditions ({result.eligibleConditions.length})
				</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.eligibleConditions as code (code)}
						<li>{conditionLabel(code)}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Additional flags -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Advisory flags for practitioner</h2>
				<ul class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<li class="rounded-lg border border-base-300 bg-base-200 p-3 text-sm">
							<div class="mb-1 flex items-center gap-2">
								<Badge priority={flag.priority} />
								<span class="text-xs text-base-content/60">{flag.id} · {flag.category}</span>
							</div>
							<div class="text-base-content/80">{flag.message}</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Eligibility justification</h2>
				<ul class="space-y-2">
					{#each result.firedRules as rule (rule.id)}
						<li class="rounded-lg border border-base-300 bg-base-200 p-3 text-sm">
							<div class="mb-1 flex items-center gap-2">
								<Badge priority={rule.priority} />
								<span class="text-xs text-base-content/60">{rule.id} · {rule.category}</span>
							</div>
							<div class="text-base-content/80">{rule.message}</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patient.forenames} {data.patient.surname}</div>
				<div><span class="font-medium text-base-content/70">DOB:</span> {data.patient.birthDate}{#if result.ageYears !== null} (Age {result.ageYears}){/if}</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patient.unitedKingdomNhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Practitioner:</span> {data.practitioner.name || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
