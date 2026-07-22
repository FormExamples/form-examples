<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the recovery record and the
	// recovery-team dashboard.
	const plural = 'post-anaesthesia-care-unit-records';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/post-anaesthesia-care-unit-record/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new record</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step PACU recovery record. One continuous single-page wizard that scores
				the patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/post-anaesthesia-care-unit-record/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Recovery-team dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recovering patients with their computed Aldrete total and readiness band, and filter
				by anaesthetic technique and readiness.
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
					Document the recovery observations and produce a graded report — Aldrete total 0-10, an
					SpO2-gated readiness band (discharge-ready requires a total &ge; 9 with the
					oxygen-saturation parameter scoring 2), optional PADSS, and flagged issues — to support a
					safe discharge decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine
					(SpO2-gated readiness), and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Modified Aldrete Score (Aldrete & Kroulik, Anesth Analg 1970; Aldrete, J
					Clin Anesth 1995) and PADSS (Chung, Can J Anaesth 1995). A documentation aid, not a
					discharge order.
				</dd>
			</div>
		</dl>
	</section>
</main>
