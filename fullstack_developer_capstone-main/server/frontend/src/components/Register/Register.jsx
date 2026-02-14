import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    if (!form.first_name.trim()) e.first_name = "First name is required.";
    if (!form.last_name.trim()) e.last_name = "Last name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      e.password = "Password is required.";
    } else if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // alan düzeldikçe hatayı temizle
    setServerError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setServerError("");
    setSuccessMsg("");

    try {
      // Backend endpoint’ini kendi projene göre düzenle:
      // Örn: Django REST: /api/register/ veya /api/auth/register/
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Django/DRF tarafında beklenen alan adlarıyla eşleştiğinden emin ol
        body: JSON.stringify({
          username: form.username,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
        }),
        credentials: "include", // session cookie kullanıyorsan açık kalsın
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Sunucudan gelen hata formatına göre uyarlayabilirsin
        // Örn: {username: ["..."], email: ["..."]} veya {detail: "..."}
        if (data && typeof data === "object") {
          // Alan bazlı hataları yakala
          const fieldErrors = {};
          for (const key of ["username", "first_name", "last_name", "email", "password"]) {
            if (data[key]) fieldErrors[key] = Array.isArray(data[key]) ? data[key][0] : String(data[key]);
          }
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
        setServerError(data.detail || data.message || "Registration failed. Please try again.");
        return;
      }

      setSuccessMsg("Registration successful. You can now sign in.");
      // İstersen alanları temizle:
      setForm({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.card} aria-labelledby="signup-title">
        <h1 id="signup-title" style={styles.title}>Sign-up</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={styles.field}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="yourusername"
              style={{ ...styles.input, ...(errors.username ? styles.inputError : {}) }}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              autoComplete="username"
              required
            />
            {errors.username && (
              <div id="username-error" style={styles.errorText}>{errors.username}</div>
            )}
          </div>

          {/* First Name */}
          <div style={styles.field}>
            <label htmlFor="first_name" style={styles.label}>First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Jane"
              style={{ ...styles.input, ...(errors.first_name ? styles.inputError : {}) }}
              aria-invalid={!!errors.first_name}
              aria-describedby={errors.first_name ? "first-name-error" : undefined}
              autoComplete="given-name"
              required
            />
            {errors.first_name && (
              <div id="first-name-error" style={styles.errorText}>{errors.first_name}</div>
            )}
          </div>

          {/* Last Name */}
          <div style={styles.field}>
            <label htmlFor="last_name" style={styles.label}>Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Doe"
              style={{ ...styles.input, ...(errors.last_name ? styles.inputError : {}) }}
              aria-invalid={!!errors.last_name}
              aria-describedby={errors.last_name ? "last-name-error" : undefined}
              autoComplete="family-name"
              required
            />
            {errors.last_name && (
              <div id="last-name-error" style={styles.errorText}>{errors.last_name}</div>
            )}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane.doe@example.com"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              required
            />
            {errors.email && (
              <div id="email-error" style={styles.errorText}>{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              autoComplete="new-password"
              required
            />
            {errors.password && (
              <div id="password-error" style={styles.errorText}>{errors.password}</div>
            )}
          </div>

          {/* Server/global error */}
          {serverError && <div role="alert" style={styles.serverError}>{serverError}</div>}

          {/* Success */}
          {successMsg && <div role="status" style={styles.success}>{successMsg}</div>}

          <button
            type="submit"
            style={styles.button}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>
      </section>
    </main>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f6f7fb",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    border: "1px solid #eaeaea",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },
  title: {
    margin: 0,
    marginBottom: "16px",
    fontSize: "1.75rem",
    fontWeight: 700,
  },
  field: {
    marginBottom: "14px",
  },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: 600,
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    fontSize: "0.95rem",
    outline: "none",
  },
  inputError: {
    borderColor: "#e02d2d",
    backgroundColor: "#fff6f6",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: "0.82rem",
    marginTop: "6px",
  },
  serverError: {
    background: "#fff1f2",
    color: "#b91c1c",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    marginBottom: "10px",
  },
  success: {
    background: "#f0fdf4",
    color: "#166534",
    padding: "10px 12px",
