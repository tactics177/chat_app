import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/api';

interface UserSidebarProps {
  token: string;
  onSelectUser: (userId: string, username: string) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ token, onSelectUser }) => {
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers(token);
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <ul className="list-group">
      {users.map((user) => (
        <li key={user.id} className="list-group-item list-group-item-action" onClick={() => onSelectUser(user.id, user.username)}>
          {user.username}
        </li>
      ))}
    </ul>
  );
};

export default UserSidebar;
