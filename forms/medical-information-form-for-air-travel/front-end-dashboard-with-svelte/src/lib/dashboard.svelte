<script lang="ts">
  import { Grid } from '@svar-ui/svelte-grid';
  import { Willow } from '@svar-ui/svelte-grid';
  import { SAMPLE_MEDIFS, type MedifRow } from './sample-data.js';

  let { rows = SAMPLE_MEDIFS as MedifRow[] }: { rows?: MedifRow[] } = $props();

  const columns = [
    { id: 'passenger', header: 'Passenger', flexgrow: 2, sort: true },
    { id: 'airline', header: 'Airline', flexgrow: 2, sort: true },
    { id: 'flight', header: 'Flight', sort: true },
    { id: 'outboundDate', header: 'Departure', sort: true },
    { id: 'band', header: 'Fitness band', flexgrow: 2, sort: true },
    { id: 'flagCount', header: 'Flags', sort: true },
    { id: 'status', header: 'Status', sort: true },
  ];
</script>

<Willow>
  <div style="height: 600px">
    <Grid data={rows} {columns} />
  </div>
</Willow>
