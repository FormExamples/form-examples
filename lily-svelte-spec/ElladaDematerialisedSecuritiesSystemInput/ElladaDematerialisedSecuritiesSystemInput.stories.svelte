<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ElladaDematerialisedSecuritiesSystemInput from './ElladaDematerialisedSecuritiesSystemInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ElladaDematerialisedSecuritiesSystemInput',
    component: ElladaDematerialisedSecuritiesSystemInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Ellada Dematerialised Securities System Input'}}
/>
