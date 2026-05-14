import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { createUser, USER_ROLES } from "../../services/users/index.js";
import { getReadableFetchError } from "../../utils/fetchError.js";
import { getPostAuthRedirect } from "../../utils/navigationState.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
};

export function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const payload = {
      name: form.name.trim(),
      password: form.password,
      email: form.email.trim(),
      role: USER_ROLES.CUSTOMER,
      phoneNumber: form.phoneNumber.trim(),
    };
    if (form.address.trim()) {
      payload.address = form.address.trim();
    }

    setSubmitting(true);
    try {
      await createUser(payload);
      setSuccess(true);
      setForm(initialForm);
      setTimeout(
        () => navigate(getPostAuthRedirect(location.state), { replace: true }),
        1200
      );
    } catch (err) {
      setError(getReadableFetchError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen title="Create account">
      <p className="muted signup-intro">Join to save addresses and track orders.</p>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="form-success" role="status">
          Account created. Redirecting…
        </p>
      ) : null}

      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="form-label">
          Name
          <input
            className="form-input"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            minLength={1}
          />
        </label>

        <label className="form-label">
          Email
          <input
            className="form-input"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </label>

        <label className="form-label">
          Password
          <input
            className="form-input"
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
            minLength={3}
          />
        </label>

        <label className="form-label">
          Phone
          <input
            className="form-input"
            type="tel"
            name="phoneNumber"
            autoComplete="tel"
            inputMode="numeric"
            value={form.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            required
            minLength={10}
          />
        </label>

        <label className="form-label">
          Address <span className="form-optional">(optional)</span>
          <textarea
            className="form-input form-textarea"
            name="address"
            autoComplete="street-address"
            rows={3}
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </label>

        <button className="form-submit" type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Sign up"}
        </button>
      </form>

      <p className="signup-footer muted">
        Already have an account?{" "}
        <Link to="/auth/login" state={location.state}>
          Log in
        </Link>
      </p>
    </Screen>
  );
}
