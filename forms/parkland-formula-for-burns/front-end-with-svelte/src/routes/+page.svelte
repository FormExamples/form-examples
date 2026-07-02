<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the calculator form and the clinician
	// dashboard.
	const plural = 'parkland-formula-for-burns-calculations';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Parkland Formula for Burns
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Fluid resuscitation for major thermal burns
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Enter body weight (kg), %TBSA burned, and the time of injury in a single continuous wizard. The
			shared engine applies the Parkland formula — total 24 h volume = 4 mL × weight × %TBSA — splits
			it 50/50 into the first 8 h (from injury) and the next 16 h, and derives an infusion rate for
			each phase, offsetting for the time already elapsed. It also reports a urine-output target of
			0.5-1.0 mL/kg/h. When more than 8 h have elapsed the first phase is overdue and the outstanding
			volume should be given now. This is a starting estimate only, not definitive burns management.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new calculation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step calculator. One continuous single-page wizard that computes the
				resuscitation plan as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed 24 h volume, first-phase rate, and plan status,
				and filter by care setting and status.
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
					Compute a starting fluid-resuscitation prescription for a major burn and produce a graded
					report — total volume, phase split, infusion rates, urine-output target, and flagged
					issues — to support early management and referral.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Parkland formula, the
					8h/16h phase split, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Parkland (Baxter) formula and National Burn Care Referral Guidance. The
					computed volume is a starting estimate; fluids must be titrated to urine output and
					physiological endpoints, and it does not replace specialist burns advice.
				</dd>
			</div>
		</dl>
	</section>
</main>
