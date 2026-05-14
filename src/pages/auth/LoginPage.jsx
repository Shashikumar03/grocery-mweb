import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { postAuthLogin } from "../../services/auth/index.js";
import { writeJson } from "../../utils/storage.js";
import { getReadableFetchError } from "../../utils/fetchError.js";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const value = emailOrPhone.trim();
    if (!value) {
      setError("Enter your email or phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await postAuthLogin({ email: value });

      if (data && typeof data === "object") {
        const token =
          data.jwtToken ??
          data.token ??
          data.accessToken ??
          data.access_token ??
          data.jwt;
        if (token) {
          writeJson("auth_token", {
            token,
            user: data.user ?? null,
            savedAt: Date.now(),
          });
        }
      }

      setSuccess("Signed in successfully.");
      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err) {
      setError(getReadableFetchError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen title="Log in">
      <p className="muted signup-intro">
        Sign in with the email or phone number you used when you registered.
      </p>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="form-success" role="status">
          {success}
        </p>
      ) : null}

      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="form-label">
          Email or phone
          <input
            className="form-input"
            name="email"
            type="text"
            autoComplete="username"
            placeholder="you@example.com or 6623051921"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </label>

        <button className="form-submit" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Continue"}
        </button>
      </form>

      <p className="signup-footer muted">
        New here?{" "}
        <Link to="/signup" state={location.state}>
          Create an account
        </Link>
      </p>
      <p className="signup-footer muted">
        <Link to="/account">Back to account</Link>
      </p>
    </Screen>
  );
}
