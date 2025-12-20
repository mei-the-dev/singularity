import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import KanbanColumn from '../components/KanbanColumn';

describe('KanbanColumn drop animation', () => {
  test('applies drop-highlight class on dragEnter and removes on dragLeave', async () => {
    const issues = [{ id: '1', title: 'Test Issue' }];
    const { getByLabelText, getByText } = render(<KanbanColumn title="Backlog" issues={issues as any} />);

    const column = getByLabelText('Backlog issues');
    const issue = getByText('Test Issue');
    const draggableWrapper = issue.parentElement as HTMLElement;
    expect(draggableWrapper).toBeTruthy();

    // Create a DataTransfer for the drag events (JSDOM provides DataTransfer in newer versions)
    const data = typeof DataTransfer !== 'undefined' ? new DataTransfer() : { setData: jest.fn(), getData: jest.fn() };
    if ((data as any).setData) (data as any).setData('text/issue-id', '1');

    fireEvent.dragStart(draggableWrapper, { dataTransfer: data });
    fireEvent.dragEnter(column, { dataTransfer: data });

    await waitFor(() => expect(column).toHaveClass('drop-highlight'));

    fireEvent.dragLeave(column, { dataTransfer: data });

    await waitFor(() => expect(column).not.toHaveClass('drop-highlight'));
  });
});
