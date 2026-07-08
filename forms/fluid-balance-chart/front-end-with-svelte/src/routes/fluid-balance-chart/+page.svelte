<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the chart wizard and the clinician
	// dashboard.
	const plural = 'fluid-balance-charts';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Fluid Balance Chart</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Intake / output monitoring chart</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside record of a patient's fluid intake and output over a charting period, completed as a
			single continuous wizard — chart context, patient weight, timed intake entries, timed output
			entries, and a summary note. It captures a parent chart header plus two repeating child lists
			(intake rows and output rows). The shared engine reconciles the recorded volumes into totals, a
			running and cumulative net balance, and the weight-indexed urine-output rate (mL/kg/h), grades
			the fluid status (Balanced, Positive, Negative, or Oliguria), and — independently — raises
			safety flags.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/fluid-balance-chart/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new chart</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step chart. One continuous single-page wizard that reconciles the balance
				and flags safety issues as you add intake and output rows.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/fluid-balance-chart/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse fluid-balance charts with their computed totals, net balance, urine-output rate, and
				fluid status, and filter by fluid status and ward.
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
					Reconcile recorded intake and output volumes and produce a fluid-balance report — totals,
					net balance, urine-output rate, fluid status, and flagged issues — to support safe,
					auditable monitoring.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the reconciliation algorithm,
					the fluid-status thresholds, and the safety-flag rules. The same engine grades both the
					form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NICE CG174 (intravenous fluid therapy in adults) and KDIGO acute-kidney-injury
					guidance (oliguria = urine output below 0.5 mL/kg/h). A monitoring aid, not a validated
					named score or a treatment decision.
				</dd>
			</div>
		</dl>
	</section>
</main>
