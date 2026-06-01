<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CyprusNationalPassportNumberView from './CyprusNationalPassportNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CyprusNationalPassportNumberView',
    component: CyprusNationalPassportNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Cyprus National Passport Number View'}}
/>
