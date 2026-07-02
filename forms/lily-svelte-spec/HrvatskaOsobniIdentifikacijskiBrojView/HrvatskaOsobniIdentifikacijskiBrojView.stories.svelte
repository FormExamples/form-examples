<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HrvatskaOsobniIdentifikacijskiBrojView from './HrvatskaOsobniIdentifikacijskiBrojView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojView',
    component: HrvatskaOsobniIdentifikacijskiBrojView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Hrvatska Osobni Identifikacijski Broj View'}}
/>
