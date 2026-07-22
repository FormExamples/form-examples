<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the chart wizard and the clinician
	// dashboard.
	const plural = 'fluid-balance-charts';
</script>

<main class="mx-16 px-4 py-12">

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
					Reconcile recorded intake and output volumes — timed entries across a parent chart header
					and two repeating intake/output lists — and produce a fluid-balance report: totals, a
					running and cumulative net balance, the weight-indexed urine-output rate (mL/kg/h), a
					fluid-status classification (Balanced, Positive, Negative, or Oliguria), and independently
					raised safety flags — to support safe, auditable monitoring.
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
