import Url from "../models/Url.js";
import crypto from "crypto";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl)
      return res.status(500).json({ message: "Url is required" });

    const existing = await Url.findOne({ originalUrl });
if (existing) {
  return res.json({
    shortUrl: `http://localhost:5000/${existing.shortCode}`
  });
}


    let shortCode;
    do {
        shortCode = crypto.randomBytes(4).toString("hex");
    } while (await Url.findOne({ shortCode }));

    const newUrl = await Url.create({
    originalUrl,
    shortCode,
    });

    res.status(201).json({
      shortUrl: `http://localhost:5000/${newUrl.shortCode}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ message: "Not found" });

    url.clicks++;

    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getStats = async (req, res) => {
  try {
    const { code } = req.params;

    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ message: "Not found" });

    res.json(url);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
