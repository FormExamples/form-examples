<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import TextField from '#lib/components/ui/TextField.svelte';
  import NumberField from '#lib/components/ui/NumberField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 3 — Trip details</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField label="Airline IATA code" bind:value={store.data.trip.airlineIataCode} hint="e.g. EK, BA, QR" />
    <TextField label="Airline name" bind:value={store.data.trip.airlineName} />
    <TextField label="Outbound flight number" bind:value={store.data.trip.outboundFlightNumber} />
    <TextField label="Outbound date" type="date" bind:value={store.data.trip.outboundDate} />
    <TextField label="Outbound origin (IATA)" bind:value={store.data.trip.outboundOriginIata} />
    <TextField label="Outbound destination (IATA)" bind:value={store.data.trip.outboundDestinationIata} />
    <TextField label="Return flight number" bind:value={store.data.trip.returnFlightNumber} />
    <TextField label="Return date" type="date" bind:value={store.data.trip.returnDate} />
    <SelectField
      label="Cabin class"
      bind:value={store.data.trip.cabinClass}
      options={[
        { value: 'economy', label: 'Economy' },
        { value: 'premium-economy', label: 'Premium economy' },
        { value: 'business', label: 'Business' },
        { value: 'first', label: 'First' },
      ]}
    />
    <NumberField
      label="Longest sector duration"
      unit="minutes"
      min={0}
      bind:value={store.data.trip.sectorDurationMinutes}
    />
    <TextField
      label="Transit airports (comma-separated IATA codes)"
      bind:value={store.data.trip.transitAirportsIata}
    />
    <TextField
      label="Special-assistance codes (e.g. WCHR,OXYG,MEDA)"
      bind:value={store.data.trip.specialAssistanceCodes}
    />
  </div>
</section>
