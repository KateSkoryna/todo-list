import { useTranslation } from 'react-i18next';
import { useTodoListsData } from '../../hooks/useTodoListsData';
import TodoLists from '../todo/TodoLists';

function VitalTaskPage() {
  const { t } = useTranslation();
  const {
    todoLists,
    isLoading,
    isError,
    error,
    refetch,
    handleDeleteList,
    handleAddTodo,
  } = useTodoListsData();

  const vitalLists = todoLists?.filter((l) => l.priority === 'high');

  return (
    <div className="space-y-4">
      <p className="text-secondary-dark-bg text-sm">
        {t('vitalTask.description')}
      </p>
      <TodoLists
        todoLists={vitalLists}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        handleDeleteList={handleDeleteList}
        handleAddTodo={handleAddTodo}
      />
    </div>
  );
}

export default VitalTaskPage;
