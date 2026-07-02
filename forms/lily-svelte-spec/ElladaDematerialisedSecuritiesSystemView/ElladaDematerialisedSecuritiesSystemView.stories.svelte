<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ElladaDematerialisedSecuritiesSystemView from './ElladaDematerialisedSecuritiesSystemView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ElladaDematerialisedSecuritiesSystemView',
    component: ElladaDematerialisedSecuritiesSystemView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Ellada Dematerialised Securities System View'}}
/>
