'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '' });
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionInProgress('create');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUsers((prev) => [data.user, ...prev]);
      setIsCreating(false);
      setNewUser({ email: '', name: '', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setActionInProgress(`delete-${userId}`);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setUsers((prev) => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "USER" | "ADMIN") => {
    setActionInProgress(`role-${userId}`);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Users</h3>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users in the system including their name, email, and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0">
            <button
              onClick={() => setIsCreating(true)}
              className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Add User
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {isCreating && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionInProgress === 'create'}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                >
                  {actionInProgress === 'create' ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created At
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as "USER" | "ADMIN")}
                          disabled={actionInProgress === `role-${user.id}`}
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionInProgress === `delete-${user.id}`}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {actionInProgress === `delete-${user.id}` ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 