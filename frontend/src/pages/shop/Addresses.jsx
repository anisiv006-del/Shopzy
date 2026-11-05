import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { usersApi } from "../../api/users";
import { apiError } from "../../api/client";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Button from "../../components/ui/Button";
export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    line: "",
    city: "",
    pincode: "",
  });
  const load = () =>
    usersApi
      .addresses()
      .then(({ data }) => setAddresses(data))
      .catch((error) => toast.error(apiError(error)));
  useEffect(load, []);
  const submit = async (event) => {
    event.preventDefault();
    try {
      await usersApi.addAddress(form);
      setForm({
        label: "Home",
        name: "",
        phone: "",
        line: "",
        city: "",
        pincode: "",
      });
      load();
      toast.success("Address saved");
    } catch (error) {
      toast.error(apiError(error));
    }
  };
  const remove = async (id) => {
    try {
      await usersApi.deleteAddress(id);
      load();
    } catch (error) {
      toast.error(apiError(error));
    }
  };
  return (
    <CustomerLayout>
      <div className="page-wrap max-w-4xl">
        <p className="font-bold text-primary">DELIVERY</p>
        <h1 className="mt-2 text-4xl font-extrabold">Saved addresses</h1>
        <form
          className="card mt-8 grid gap-3 p-6 sm:grid-cols-2"
          onSubmit={submit}
        >
          {Object.keys(form).map((field) => (
            <input
              className="field"
              placeholder={field}
              required
              key={field}
              value={form[field]}
              onChange={(event) =>
                setForm({ ...form, [field]: event.target.value })
              }
            />
          ))}
          <Button className="sm:col-span-2">Save address</Button>
        </form>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <article className="card p-5" key={address._id}>
              <div className="flex justify-between">
                <b>{address.label}</b>
                <button
                  className="text-coral"
                  onClick={() => remove(address._id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {address.name}
                <br />
                {address.phone}
                <br />
                {address.line}, {address.city} {address.pincode}
              </p>
            </article>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
