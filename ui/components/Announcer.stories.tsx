import React from 'react';
import AnnouncerProvider, { useAnnouncer } from './Announcer';

export default { title: 'Accessibility/Announcer' };

const Demo = () => {
  const { announce } = useAnnouncer();
  return <button onClick={() => announce('Test announcement: Issue moved to In Progress')}>Announce</button>;
};

export const Default = () => (
  <AnnouncerProvider>
    <Demo />
  </AnnouncerProvider>
);
