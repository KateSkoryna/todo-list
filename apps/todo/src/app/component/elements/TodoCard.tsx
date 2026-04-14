import { MapPin } from 'lucide-react';
import { FlatItem } from '../pages/DashboardPage';
import { PRIORITY_COLORS } from '../../constants/todolist.constants';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700 border border-blue-300',
  failed: 'bg-red-100 text-red-700 border border-red-300',
  successful: 'bg-green-100 text-green-700 border border-green-300',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'In Progress',
  failed: 'Not Started',
  successful: 'Completed',
};

function TodoCard({ item }: { item: FlatItem }) {
  return (
    <div className="rounded-xl border border-secondary-bg bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-dark-bg leading-snug">{item.name}</p>
          {item.notes && (
            <p className="text-sm text-secondary-dark-bg line-clamp-2 mt-1">
              {item.notes}
            </p>
          )}
          {item.location && (
            <p className="flex items-center gap-1 text-xs text-secondary-dark-bg mt-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {item.location}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                STATUS_STYLES[item.status]
              }`}
            >
              {STATUS_LABELS[item.status]}
            </span>
            {item.listPriority && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  PRIORITY_COLORS[item.listPriority]
                }`}
              >
                {item.listPriority}
              </span>
            )}
          </div>
        </div>
        {item.dueDate && (
          <span className="text-xs text-secondary-dark-bg shrink-0 mt-0.5">
            {new Date(item.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
  );
}

export default TodoCard;
