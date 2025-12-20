import React from 'react';
import KanbanColumn from './KanbanColumn';

export default {
  title: 'Components/KanbanColumn',
  component: KanbanColumn,
};

export const Backlog = () => (
  <div style={{ width: 360 }}>
    <KanbanColumn title="Backlog" issues={[{ id: '1', title: 'Research black box' }, { id: '2', title: 'Spec event horizon' }]} />
  </div>
);

export const InProgress = () => (
  <div style={{ width: 360 }}>
    <KanbanColumn title="In Progress" issues={[{ id: '3', title: 'Implement toast provider' }]} />
  </div>
);
