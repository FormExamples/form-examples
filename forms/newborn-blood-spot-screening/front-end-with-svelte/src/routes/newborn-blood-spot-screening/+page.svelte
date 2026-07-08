<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the screening form and the clinician
	// dashboard.
	const plural = 'newborn-blood-spot-screenings';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Newborn Blood Spot Screening
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">NHS newborn blood spot screening</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A documentation and result-classification record for the NHS newborn blood spot (heel-prick)
			screening test, normally taken around day 5 of life, completed as a single continuous wizard.
			It records the sample event and its quality, eligibility and consent, and a per-condition
			result for nine screened conditions — <strong>SCD</strong>, <strong>CF</strong>,
			<strong>CHT</strong>, <strong>PKU</strong>, <strong>MCADD</strong>, <strong>MSUD</strong>,
			<strong>IVA</strong>, <strong>GA1</strong>, and <strong>HCU</strong>. A pure engine classifies
			each condition, derives the overall screening outcome by precedence, and raises flags — any
			<strong>suspected</strong> result triggers an urgent specialist referral. This is a
			classification form: there is no numeric score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/newborn-blood-spot-screening/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new screening</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step blood spot record. One continuous single-page wizard that classifies
				the screening outcome as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/newborn-blood-spot-screening/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse screened babies with their computed screening outcome, referral status, and referral
				and flag counts, and filter by outcome and referral status.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture the sample event, quality, consent, and the nine per-condition results, and
					produce a graded report — an overall screening outcome, referral status, urgent
					referrals, and flagged issues — to support timely newborn screening and referral.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the per-condition
					classification engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the NHS Newborn Blood Spot Screening Programme handbook and standards. A
					screening prompt, not a diagnosis: a suspected screen identifies a baby who needs urgent
					diagnostic assessment.
				</dd>
			</div>
		</dl>
	</section>
</main>
