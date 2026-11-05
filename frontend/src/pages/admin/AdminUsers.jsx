import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "../../api/users";
import { apiError } from "../../api/client";
import AdminLayout from "../../components/layout/AdminLayout";
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    usersApi
      .list()
      .then(({ data }) => setUsers(data))
      .catch((error) => toast.error(apiError(error)));
  }, []);
  const remove = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await usersApi.delete(id);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      toast.error(apiError(error));
    }
  };
  return (
    <AdminLayout>
      <div className="page-wrap">
        <h1 className="text-4xl font-extrabold">Users</h1>
        <div className="card mt-8 overflow-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                {["Name", "Email", "Age", "Role", "Verified", "Action"].map(
                  (heading) => (
                    <th className="p-4" key={heading}>
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  className="border-b border-slate-100 dark:border-slate-800"
                  key={user._id}
                >
                  <td className="p-4 font-bold">{user.username}</td>
                  <td className="p-4">{user.emailId}</td>
                  <td className="p-4">{user.age}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">{user.isEmailVerified ? "Yes" : "No"}</td>
                  <td className="p-4">
                    <button
                      className="font-bold text-coral disabled:opacity-30"
                      disabled={user.role === "admin"}
                      onClick={() => remove(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
