import React from 'react';
import KanbanColumn from './KanbanColumn';

export default {
  title: 'Components/KanbanColumn',
  component: KanbanColumn,
};

export const Default = () => (
  <KanbanColumn title="Backlog" issues={[{ id: '1', title: 'Sample', assignee: 'Unassigned' }]} />
);
