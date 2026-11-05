import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { client, apiError } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import AuthFrame from "../../components/auth/AuthFrame";
import Button from "../../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailId: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("user");
  const [busy, setBusy] = useState(false);
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const send = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await client.post("/login", form);
      setStep(2);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(
        error.response?.status === 429
          ? "Too many attempts. Try again shortly."
          : apiError(error),
      );
    } finally {
      setBusy(false);
    }
  };
  const verify = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await client.post("/verify-otp", {
        emailId: form.emailId,
        otp,
      });
      if (data.user.role !== role)
        return toast.error(
          `This account is not an ${role === "admin" ? "admin" : "customer"} account`,
        );
      login({ token: data.token, user: data.user });
      navigate(data.user.role === "admin" ? "/admin" : "/shop");
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthFrame
      title={step === 1 ? "Welcome back" : "Verify your email"}
      subtitle={
        step === 1
          ? "Sign in to your Shopzy account."
          : `Enter the code sent to ${form.emailId}`
      }
    >
      <div className="mt-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        <button
          className={`flex-1 rounded-lg py-2 text-sm font-bold ${role === "user" ? "bg-white shadow dark:bg-slate-800" : ""}`}
          onClick={() => setRole("user")}
        >
          Customer
        </button>
        <button
          className={`flex-1 rounded-lg py-2 text-sm font-bold ${role === "admin" ? "bg-white shadow dark:bg-slate-800" : ""}`}
          onClick={() => setRole("admin")}
        >
          Admin
        </button>
      </div>
      {step === 1 ? (
        <form className="mt-6 space-y-4" onSubmit={send}>
          <label className="field-label">
            Email
            <input
              className="field"
              name="emailId"
              type="email"
              required
              value={form.emailId}
              onChange={update}
            />
          </label>
          <label className="field-label">
            Password
            <input
              className="field"
              name="password"
              type="password"
              minLength="8"
              required
              value={form.password}
              onChange={update}
            />
          </label>
          <Button className="w-full" disabled={busy}>
            {busy ? "Sending OTP..." : "Send OTP"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            New here?{" "}
            <Link className="font-bold text-primary" to="/register">
              Create an account
            </Link>
          </p>
        </form>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={verify}>
          <input
            className="field text-center text-3xl tracking-[.6em]"
            autoFocus
            maxLength="6"
            inputMode="numeric"
            required
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="••••••"
          />
          <Button className="w-full" disabled={busy || otp.length !== 6}>
            {busy ? "Verifying..." : "Verify & continue"}
          </Button>
          <button
            type="button"
            className="w-full text-sm font-bold text-primary"
            onClick={() => setStep(1)}
          >
            Change email
          </button>
        </form>
      )}
    </AuthFrame>
  );
}
