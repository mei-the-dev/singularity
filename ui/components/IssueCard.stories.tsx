import React from 'react';
import IssueCard from './IssueCard';

export default {
  title: 'Components/IssueCard',
  component: IssueCard,
};

export const Default = () => <IssueCard issue={{ id: '1', title: 'Snapshot Test', status: 'backlog' }} />;
