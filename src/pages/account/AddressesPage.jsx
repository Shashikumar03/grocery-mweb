import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import {
  createDeliveryAddress,
  deleteDeliveryAddress,
  fetchDeliveryAddresses,
  getDeliveryAddressId,
  normalizeDeliveryAddressBody,
  updateDeliveryAddress,
} from "../../services/address/index.js";
import { getReadableFetchError } from "../../utils/fetchError.js";
import { getAuthToken, getLoggedInUserId } from "../../utils/authSession.js";

const emptyForm = {
  address: "",
  landmark: "",
  mobile: "",
  city: "",
  state: "",
  pin: "",
};

/** @param {Record<string, unknown>} row */
function rowToForm(row) {
  return {
    address: String(row.address ?? row.streetAddress ?? ""),
    landmark: String(row.landmark ?? ""),
    mobile: String(row.mobile ?? row.phoneNumber ?? row.phone ?? ""),
    city: String(row.city ?? ""),
    state: String(row.state ?? ""),
    pin: String(row.pin ?? row.pincode ?? row.zipCode ?? ""),
  };
}

export function AddressesPage() {
  const userId = getLoggedInUserId();
  const token = getAuthToken();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [mode, setMode] = useState("idle");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    if (userId == null || !token) {
      setList([]);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const rows = await fetchDeliveryAddresses(userId);
      setList(rows);
    } catch (e) {
      setList([]);
      setError(getReadableFetchError(e));
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    load();
  }, [load]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setMode("add");
    setFormError("");
  }

  /** @param {Record<string, unknown>} row */
  function openEdit(row) {
    const id = getDeliveryAddressId(row);
    if (id == null) return;
    setForm(rowToForm(row));
    setEditingId(id);
    setMode("edit");
    setFormError("");
  }

  function cancelForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMode("idle");
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const payload = normalizeDeliveryAddressBody(form);
    if (!payload.address || !payload.mobile || !payload.city || !payload.state || !payload.pin) {
      setFormError("Please fill address, mobile, city, state, and PIN.");
      return;
    }
    if (!/^\d{10}$/.test(payload.mobile)) {
      setFormError("Mobile number must be exactly 10 digits");
      return;
    }
    if (!/^\d{6}$/.test(payload.pin)) {
      setFormError("Pin code must be exactly 6 digits");
      return;
    }
    if (userId == null) return;

    setSaving(true);
    try {
      if (mode === "edit" && editingId != null) {
        await updateDeliveryAddress(editingId, payload);
      } else {
        await createDeliveryAddress(userId, payload);
      }
      cancelForm();
      await load();
    } catch (err) {
      setFormError(getReadableFetchError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row) {
    const id = getDeliveryAddressId(row);
    if (id == null) return;
    if (!window.confirm("Remove this address?")) return;
    setError("");
    try {
      await deleteDeliveryAddress(id);
      if (editingId === id) cancelForm();
      await load();
    } catch (err) {
      setError(getReadableFetchError(err));
    }
  }

  if (userId == null || !token) {
    return (
      <Screen title="Addresses">
        <p className="muted">Log in to save and manage delivery addresses.</p>
        <p className="account-actions">
          <Link to="/auth/login" state={{ from: "/account/addresses" }} className="account-actions__primary">
            Log in
          </Link>
        </p>
        <p className="signup-footer muted">
          <Link to="/account">← Back to profile</Link>
        </p>
      </Screen>
    );
  }

  return (
    <Screen title="Addresses">
      <p className="addr-back">
        <Link to="/account">← Profile</Link>
      </p>

      {loading ? <p className="muted">Loading addresses…</p> : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && list.length === 0 && mode === "idle" ? (
        <p className="muted addr-empty">No saved addresses yet.</p>
      ) : null}

      <ul className="addr-list">
        {list.map((row) => {
          const id = getDeliveryAddressId(row);
          const f = rowToForm(row);
          return (
            <li key={id ?? JSON.stringify(row)} className="addr-card">
              <p className="addr-card__line">{f.address}</p>
              {f.landmark ? (
                <p className="addr-card__meta muted">Near {f.landmark}</p>
              ) : null}
              <p className="addr-card__meta">
                {f.city}, {f.state} — {f.pin}
              </p>
              <p className="addr-card__meta muted">Phone: {f.mobile}</p>
              <div className="addr-card__actions">
                <button type="button" className="addr-btn addr-btn--ghost" onClick={() => openEdit(row)}>
                  Edit
                </button>
                <button type="button" className="addr-btn addr-btn--danger" onClick={() => handleDelete(row)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {mode === "idle" ? (
        <p className="account-actions">
          <button type="button" className="account-actions__primary" onClick={openAdd}>
            Add new address
          </button>
        </p>
      ) : null}

      {mode === "add" || mode === "edit" ? (
        <form className="addr-form form-stack" onSubmit={handleSubmit}>
          <h2 className="addr-form__title">{mode === "edit" ? "Edit address" : "New address"}</h2>
          {formError ? (
            <p className="form-error" role="alert">
              {formError}
            </p>
          ) : null}

          <label className="form-label">
            Address
            <textarea
              className="form-input form-textarea"
              rows={2}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            Landmark
            <input
              className="form-input"
              value={form.landmark}
              onChange={(e) => updateField("landmark", e.target.value)}
            />
          </label>
          <label className="form-label">
            Mobile
            <input
              className="form-input"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit number"
              maxLength={10}
              value={form.mobile}
              onChange={(e) =>
                updateField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              required
            />
          </label>
          <label className="form-label">
            City
            <input
              className="form-input"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            State
            <input
              className="form-input"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            PIN
            <input
              className="form-input"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="6-digit PIN"
              maxLength={6}
              value={form.pin}
              onChange={(e) =>
                updateField("pin", e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
            />
          </label>

          <div className="addr-form__btns">
            <button className="form-submit" type="submit" disabled={saving}>
              {saving ? "Saving…" : mode === "edit" ? "Update address" : "Save address"}
            </button>
            <button type="button" className="addr-btn addr-btn--ghost addr-btn--block" onClick={cancelForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </Screen>
  );
}
