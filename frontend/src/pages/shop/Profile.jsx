import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "../../api/users";
import { apiError } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Button from "../../components/ui/Button";
export default function Profile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    usersApi
      .profile()
      .then(({ data }) => setProfile({ ...user, ...data }))
      .catch((error) => toast.error(apiError(error)));
  }, []);
  const save = async () => {
    try {
      await usersApi.update({
        username: profile.username,
        age: Number(profile.age),
      });
      login({
        ...JSON.parse(localStorage.getItem("shop_session")),
        user: { ...user, username: profile.username, age: profile.age },
      });
      setEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(apiError(error));
    }
  };
  return (
    <CustomerLayout>
      <div className="page-wrap max-w-4xl">
        <div className="card flex items-center gap-5 p-7">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-2xl font-bold text-white shadow-sm shadow-green-200">
            {initials(profile?.username)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{profile?.username}</h1>
            <p className="text-slate-500">{profile?.emailId}</p>
            <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-primary">
              {profile?.role}
            </span>
          </div>
        </div>
        <section className="card mt-5 p-7">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Personal details</h2>
            <button
              className="font-bold text-primary"
              onClick={() => setEditing(!editing)}
            >
              Edit
            </button>
          </div>
          {editing ? (
            <div className="mt-5 space-y-3">
              <input
                className="field"
                value={profile.username}
                onChange={(event) =>
                  setProfile({ ...profile, username: event.target.value })
                }
              />
              <input
                className="field"
                type="number"
                value={profile.age}
                onChange={(event) =>
                  setProfile({ ...profile, age: event.target.value })
                }
              />
              <Button onClick={save}>Save changes</Button>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-3 text-sm">
              <div>
                <small className="text-slate-500">Username</small>
                <p className="font-semibold">{profile?.username}</p>
              </div>
              <div>
                <small className="text-slate-500">Email</small>
                <p className="font-semibold">{profile?.emailId}</p>
              </div>
              <div>
                <small className="text-slate-500">Age</small>
                <p className="font-semibold">{profile?.age}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </CustomerLayout>
  );
}
