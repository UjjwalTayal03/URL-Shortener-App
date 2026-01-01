import { useState, useEffect } from "react";
import api from "../services/api.js";
import React from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clicks, setClicks] = useState(0);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/shorten", { originalUrl: url.trim() });
      setShortUrl(res.data.shortUrl);

      const code = res.data.shortUrl.split("/").pop();
      fetchStats(code);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (code) => {
    const res = await api.get(`/stats/${code}`);
    setClicks(res.data.clicks);
  };


  useEffect(() => {
    if (!shortUrl) return;

    const code = shortUrl.split("/").pop();
    const interval = setInterval(() => fetchStats(code), 2000);

    return () => clearInterval(interval);
  }, [shortUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-[380px] text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          URL Shortener
        </h1>

        <input
          type="text"
          placeholder="Paste your long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !url}
          className="w-full mt-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-500 text-white font-medium transition disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {shortUrl && (
          <div className="mt-6 bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Your short link</p>

            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                title={shortUrl}
                className="text-purple-600 font-medium truncate flex-1"
              >
                {shortUrl}
              </a>

              <button
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="px-3 py-1 text-sm bg-purple-400 hover:bg-purple-500 text-white rounded-md transition"
              >
                Copy
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Clicks: <span className="font-medium text-gray-700">{clicks}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
