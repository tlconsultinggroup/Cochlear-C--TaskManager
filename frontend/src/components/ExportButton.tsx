import React, { useCallback, useState } from 'react';
import { Task } from '../types';

interface ExportButtonProps {
  tasks: Task[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ tasks }) => {
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = useCallback(() => {
    setExportError(null);
    try {
      const outstandingTasks = tasks.filter(task => !task.completed);

      if (outstandingTasks.length === 0) {
        return;
      }

      const header = 'id,title,createdAt';
      const rows = outstandingTasks.map(
        task => `${task.id},"${task.title.replace(/"/g, '""')}",${task.createdAt}`
      );
      const csv = [header, ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'outstanding-tasks.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError('Failed to export tasks. Please try again.');
    }
  }, [tasks]);

  const outstandingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="export-button-container">
      <button
        className="export-button"
        onClick={handleExport}
        disabled={outstandingCount === 0}
        aria-label={`Download ${outstandingCount} outstanding task${outstandingCount !== 1 ? 's' : ''} as CSV`}
      >
        Download CSV ({outstandingCount})
      </button>
      {exportError && (
        <span className="export-error" role="alert">
          {exportError}
        </span>
      )}
    </div>
  );
};

export default ExportButton;
