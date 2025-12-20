import '../app/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
  backgrounds: {
    default: 'space-black',
    values: [
      { name: 'space-black', value: '#040407' },
      { name: 'panel', value: 'rgba(14,12,15,0.6)' },
    ],
  },
};
