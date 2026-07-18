<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the LP1H application wizard and the
	// clinician / case-worker dashboard.
	const plural = 'united-kingdom-lasting-powers-of-attorney-for-health-and-care-decisions';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			UK Lasting Power of Attorney
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Health and Care Decisions (LP1H)</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A digital implementation of the statutory LP1H form under the Mental Capacity Act 2005
			(England and Wales), completed as a single continuous wizard whose shared validity engine
			checks every entry against the Act and the LPA Regulations 2007, raises fired statutory rules
			and ambiguity flags, and reports an overall validity status.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new application</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step LP1H wizard. One continuous single-page form that computes statutory
				validity as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Case-worker dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse LP1H applications with their computed validity status and completeness, and filter by
				validity status and jurisdiction.
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
					Capture every LP1H field — donor, scope and activation, attorneys, decision rules, replacement
					attorneys, life-sustaining treatment, preferences, instructions, people to notify, certificate
					provider, signatures, and registration — and produce a registration-ready application bundle
					for the Office of the Public Guardian, with statutory validity and flagged issues.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the validity engine, and the
					rule catalogue. The same engine drives both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in the Mental Capacity Act 2005, the MCA Code of Practice, and the Lasting Powers
					of Attorney, Enduring Powers of Attorney and Public Guardian Regulations 2007.
				</dd>
			</div>
		</dl>
	</section>
</main>
