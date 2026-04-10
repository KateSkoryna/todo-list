import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
}

interface DropdownProps {
  users: User[];
}

const Dropdown: React.FC<DropdownProps> = ({ users }) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const selectedUser = users.find((u) => u.id === userId);

  const handleItemClick = (user: User) => {
    navigate(`/users/${user.id}`);

    const detailsElement = document.querySelector('details');
    if (detailsElement) {
      detailsElement.removeAttribute('open');
    }
  };
  return (
    <details className="relative inline-block text-left w-full">
      <summary className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-dark-bg text-sm font-medium text-white focus:outline-none cursor-pointer">
        <span>{selectedUser ? selectedUser.name : 'Select a User'}</span>
        <ChevronDown className="ml-2 h-5 w-5" />
      </summary>

      <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
        <ul className="py-1 list-none" role="listbox">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleItemClick(user)}
              className="hover:bg-gray-100 transition-colors"
            >
              <label
                htmlFor={user.id}
                className="flex items-center px-4 py-2 text-sm text-dark-bg cursor-pointer w-full"
              >
                <input
                  type="radio"
                  name="user-selection"
                  className="mr-3 h-4 w-4"
                  checked={selectedUser?.id === user.id}
                  readOnly
                  id={user.id}
                />
                {user.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};

export default Dropdown;
