<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the LPA wizard and the dashboard. The
	// collection routes hold the actual functionality.
	const plural = 'united-kingdom-lasting-powers-of-attorney-for-financial-decisions';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			UK Lasting Power of Attorney for Financial Decisions
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Property and financial affairs LPA (LP1F)
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The LP1F is the official UK statutory deed under the Mental Capacity Act 2005 by which a donor
			appoints attorneys to make decisions about their property and financial affairs, completed as a
			15-section single-page wizard whose validation engine fires statutory blocker rules and
			additional flags so the deed is correct before it is signed and sent to the Office of the Public
			Guardian.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-lasting-power-of-attorney-for-financial-decisions/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new LPA</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step LP1F form. One continuous single-page wizard that validates the deed
				against the statutory rules as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-lasting-power-of-attorney-for-financial-decisions/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Case dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse LPAs with their computed validity band and composite risk, and filter by decision mode
				and composite risk.
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
					Capture a structured LP1F deed — donor, attorneys, decision mode, replacement attorneys, when
					attorneys can act, people to notify, preferences and instructions, signatures, applicant,
					recipient, and registration — and produce a validated result (validity band, composite risk,
					fired statutory blockers, and additional flags) so it is correct before signing and
					registration.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the validation engine, and the
					blocker and flag rules. The same engine drives both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Legal grounding</dt>
				<dd class="mt-1 text-base-content/70">
					Mental Capacity Act 2005 Part 1; the Lasting Powers of Attorney, Enduring Powers of Attorney
					and Public Guardian Regulations 2007 (SI 2007/1253); OPG forms LP1F, LP12, LPC, LPA120A.
				</dd>
			</div>
		</dl>
	</section>
</main>
