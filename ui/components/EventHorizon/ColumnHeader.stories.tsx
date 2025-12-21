import React from 'react'
import ColumnHeader from './ColumnHeader'
import type { Meta } from '@storybook/react'

const meta: Meta<typeof ColumnHeader> = {
  title: 'Dashboard/ColumnHeader',
  component: ColumnHeader,
}

export default meta

export const Default = () => <ColumnHeader title="Backlog" count={3} />
