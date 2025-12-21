import React from 'react';

export interface TestCardProps {
  title: string;
  value: string;
}

export const TestCard: React.FC<TestCardProps> = ({ title, value }) => {
  return (
    <div className="testcard-root bg-muted border-muted rounded-xl p-6" data-testid="testcard-root">
      <h3 className="testcard-title mb-2">{title}</h3>
      <div className="testcard-value">{value}</div>
    </div>
  );
};

export default TestCard;
