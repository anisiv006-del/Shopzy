import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { client, apiError } from "../../api/client";
import AuthFrame from "../../components/auth/AuthFrame";
import Button from "../../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    emailId: "",
    age: "",
    password: "",
    confirm: "",
  });
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (
      +form.age < 1 ||
      +form.age > 120 ||
      form.password.length < 8 ||
      form.password.length > 72 ||
      form.password !== form.confirm
    )
      return toast.error("Check age, password length, and confirmation.");
    try {
      await client.post("/users", {
        username: form.username,
        emailId: form.emailId,
        age: Number(form.age),
        password: form.password,
      });
      toast.success("Account created");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.status === 409
          ? "Email already registered"
          : apiError(error),
      );
    }
  };
  return (
    <AuthFrame
      title="Create your account"
      subtitle="Join a more considered way to shop."
    >
      <form className="mt-6 space-y-3" onSubmit={submit}>
        {[
          ["username", "Username", "text"],
          ["emailId", "Email", "email"],
          ["age", "Age", "number"],
          ["password", "Password", "password"],
          ["confirm", "Confirm password", "password"],
        ].map(([name, label, type]) => (
          <label className="field-label" key={name}>
            {label}
            <input
              className="field"
              name={name}
              type={type}
              required
              value={form[name]}
              onChange={update}
            />
          </label>
        ))}
        <Button className="w-full">Create account</Button>
        <p className="text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link className="font-bold text-primary" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
}
