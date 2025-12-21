import React from 'react';

export interface TestCardProps {
  title: string;
  value: string;
}

export const TestCard: React.FC<TestCardProps> = ({ title, value }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm text-slate-400 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-slate-100">{value}</div>
    </div>
  );
};

export default TestCard;
