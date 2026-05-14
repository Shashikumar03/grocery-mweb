import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { clearAuthSession, readAuthSession } from "../../utils/authSession.js";

function pickProfileRows(user) {
  if (!user || typeof user !== "object") return [];
  /** @type {Array<[string, string]>} */
  const rows = [];
  const name = user.name;
  if (name != null && String(name).trim()) rows.push(["Name", String(name)]);
  const email = user.email ?? user.username;
  if (email != null && String(email).trim()) rows.push(["Email", String(email)]);
  const phone = user.phoneNumber;
  if (phone != null && String(phone).trim()) rows.push(["Phone", String(phone)]);
  const role = user.role;
  if (role != null && String(role).trim()) rows.push(["Role", String(role)]);
  if (user.id != null) rows.push(["User ID", String(user.id)]);
  return rows;
}

export function AccountPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => readAuthSession());
  const user = session?.user && typeof session.user === "object" ? session.user : null;
  const token = typeof session?.token === "string" ? session.token : null;
  const loggedIn = Boolean(token && user);

  const rows = useMemo(() => pickProfileRows(user), [user]);

  function handleLogout() {
    clearAuthSession();
    setSession(null);
    navigate("/account", { replace: true });
  }

  return (
    <Screen title={loggedIn ? "Your profile" : "Account"}>
      {!loggedIn ? (
        <>
          <p className="muted">Log in to see your profile and saved details.</p>
          <p className="account-actions">
            <Link to="/auth/login" className="account-actions__primary">
              Log in
            </Link>
          </p>
          <p className="account-actions account-actions--tight">
            <Link to="/signup" className="account-actions__outline">
              Create account
            </Link>
          </p>
        </>
      ) : (
        <>
          <div className="profile-card">
            <div className="profile-card__avatar" aria-hidden>
              {(String(user.name || user.email || user.username || "?")
                .trim()
                .charAt(0) || "?").toUpperCase()}
            </div>
            <dl className="profile-dl">
              {rows.map(([label, value]) => (
                <div key={label} className="profile-dl__row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="account-actions account-actions--tight">
            <Link to="/orders" className="account-actions__primary">
              Your orders
            </Link>
          </p>
          <p className="account-actions account-actions--tight">
            <Link to="/account/addresses" className="account-actions__outline">
              Saved addresses
            </Link>
          </p>
          <button
            type="button"
            className="account-actions__outline profile-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </>
      )}
    </Screen>
  );
}
