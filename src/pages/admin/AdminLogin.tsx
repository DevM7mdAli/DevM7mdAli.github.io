import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signInAdmin, getCurrentAdminUser } from "../../lib/supabase";
import { useUIStore } from "../../stores/uiStore";
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaArrowLeft,
  FaShieldAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Redirect if already logged in
    getCurrentAdminUser().then((user) => {
      if (user) {
        navigate("/manage", { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      await signInAdmin(email, password);
      navigate("/manage", { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold tracking-wide transition-colors"
        style={{ color: "var(--color-muted)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-muted)")}
      >
        <FaArrowLeft size={12} />
        <span>{t("manage.login.back")}</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl p-8 border backdrop-blur-2xl shadow-2xl flex flex-col gap-6 relative z-10"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
            style={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            <FaShieldAlt size={24} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("manage.login.title")}
            </h1>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--color-muted)" }}>
              {t("manage.login.subtitle")}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div
            className="p-3.5 rounded-xl text-xs leading-relaxed font-medium"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="text-xs font-medium mb-1.5 block font-mono"
              style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}
            >
              {t("manage.login.email")}
            </label>
            <div className="relative">
              <FaEnvelope
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-muted)" }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="form-input pl-10"
              />
            </div>
          </div>

          <div>
            <label
              className="text-xs font-medium mb-1.5 block font-mono"
              style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}
            >
              {t("manage.login.password")}
            </label>
            <div className="relative">
              <FaLock
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-muted)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--color-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-muted)")}
              >
                {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <FaSpinner size={14} className="animate-spin" />
            ) : (
              t("manage.login.submit")
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
