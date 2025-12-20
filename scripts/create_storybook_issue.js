import('../mcp/tools/git.js').then(async (m)=>{
  const res = await m.createIssue({
    title: 'task(ui): Implement Storybook + tests for every component',
    body: [
      'Goal: Ensure every UI component has a Storybook story (tags:[\'autodocs\']) and at least one Playwright visual or interaction test.',
      '',
      'Steps:',
      '1) Discovery: call mcp tool list-all-components to build inventory of components and flag missing stories.',
      '2) Author stories for missing components following CSF3 + autodocs.',
      '3) Add Playwright tests per story (visual+interaction).',
      '4) Add CI smoke-check that calls list-all-components and fails if critical components missing.',
      '',
      'Start: Discovery (list-all-components) and generate per-component sub-tasks.'
    ].join('\n')
  });
  console.log(JSON.stringify(res));
  if (res && res.url) {
    const m = res.url.match(/issues\/(\d+)/);
    if (m) console.log('ISSUE_NUM:'+m[1]);
  }
}).catch(e=>console.error('ERR',e&&e.message));
