import React from 'react';
import IssueCard from './IssueCard';

export default {
  title: 'Components/IssueCard',
  component: IssueCard,
};

export const Default = () => (
  <div style={{ width: 360 }}>
    <IssueCard issue={{ id: '1', title: 'Fix login flow', assignee: 'Ada' }} />
  </div>
);

export const LongTitle = () => (
  <div style={{ width: 360 }}>
    <IssueCard issue={{ id: '2', title: 'Improve the singularity bootstrap process to reduce cold starts', assignee: 'Turing' }} />
  </div>
);
