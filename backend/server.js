const express = require("express");
const cors = require("cors");
const pool = require("./db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors({
  origin: "*"
}));

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 24* 60* 60 * 1000, // 1 day
  max: 1000, // limit each IP to 1000 requests
  message: {
    success: false,
    message: "Too many requests, please try again later"
  }
});
function generateApiKey() {
  const key = "ak_" + crypto.randomBytes(16).toString("hex");
  const secret = "as_" + crypto.randomBytes(16).toString("hex");

  return { key, secret };
}



async function checkApiKey(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({ error: "API key missing" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM api_keys WHERE key = $1",
      [key]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    req.apiKey = result.rows[0];
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


async function checkApiSecret(req, res, next) {
  // Only check for write methods
  if (req.method === "GET"  || req.method === "DELETE") {
    return next();
  }

  const secret = req.headers["x-api-secret"];

  if (!secret) {
    return res.status(401).json({
      success: false,
      message: "API secret missing"
    });
  }

  try {
    const isValid = await bcrypt.compare(
      secret,
      req.apiKey.secret_hash
    );

    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid API secret"
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

function logApiUsage(req, res, next) {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    try {
      await pool.query(
        `INSERT INTO api_logs (api_key, endpoint, response_time, status_code)
         VALUES ($1, $2, $3, $4)`,
        [
          req.headers["x-api-key"] || "unknown",
          req.originalUrl,
          duration,
          res.statusCode
        ]
      );
    } catch (err) {
      console.error("Logging error:", err);
    }
  });

  next();
}

app.get("/generate-key", async (req, res) => {
  try {
    const { key, secret } = generateApiKey();

    const hashedSecret = await bcrypt.hash(secret, 10);

    await pool.query(
      "INSERT INTO api_keys (key, secret_hash) VALUES ($1, $2)",
      [key, hashedSecret]
    );

    res.json({
      apiKey: key,
      apiSecret: secret, // ⚠️ show only once
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate API key"
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const result = await pool.query(
      "INSERT INTO users (email, plan) VALUES ($1, 'Free') ",
      [email]
    );

    res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
});

app.use("/v1", checkApiKey);
app.use("/v1", limiter);
app.use("/v1", logApiUsage);
app.use("/v1", checkApiSecret);

// 👉 ADD YOUR API HERE
app.get("/v1/states", async (req, res) => {
  const start = Date.now();
  try {
    const result = await pool.query(
      "SELECT id, name FROM state ORDER BY name"
    );

    const time = Date.now() - start;

    
   await pool.query(
  "INSERT INTO api_logs (api_key, endpoint, response_time) VALUES ($1, $2, $3)",
  [req.headers["x-api-key"], "/v1/states", 30]
);


    res.json({
  success: true,
  count: result.rows.length,
  data: result.rows,
  meta: {
    requestId: "req_" + Date.now(),
    responseTime: time,
  },
});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get("/v1/states/:id/districts", async (req, res) => {
  try {
    const start = Date.now();
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, name FROM district WHERE state_id = $1 ORDER BY name",
      [id]
    );

    const time = Date.now() - start; // ✅ STEP 2: calculate time

    // ✅ STEP 3: log into DB
    await pool.query(
  "INSERT INTO api_logs (api_key, endpoint, response_time) VALUES ($1, $2, $3)",
  [req.headers["x-api-key"], "/v1/states/:id/districts", 30]
);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get("/v1/districts/:id/subdistricts", async (req, res) => {
  try {
    const start = Date.now();
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, name FROM sub_district WHERE district_id = $1 ORDER BY name",
      [id]
    );

    const time = Date.now() - start; // ✅ STEP 2: calculate time

    // ✅ STEP 3: log into DB
    await pool.query(
  "INSERT INTO api_logs (api_key, endpoint, response_time) VALUES ($1, $2, $3)",
  [req.headers["x-api-key"], "/v1/districts/:id/subdistricts", 30]
);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get("/v1/subdistricts/:id/villages", async (req, res) => {
  try {
    const start = Date.now();
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, name FROM village WHERE sub_district_id = $1 ORDER BY name LIMIT 100",
      [id]
    );

    const time = Date.now() - start; // ✅ STEP 2: calculate time

    // ✅ STEP 3: log into DB
    await pool.query(
      "INSERT INTO api_logs (endpoint, response_time) VALUES ($1, $2)",
      [req.originalUrl, time]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get("/v1/autocomplete", async (req, res) => {
  try {
    const start = Date.now();
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 2 characters"
      });
    }

    const result = await pool.query(
      `
      SELECT 
        v.id,
        v.name AS village,
        sd.name AS sub_district,
        d.name AS district,
        s.name AS state
      FROM village v
      JOIN sub_district sd ON v.sub_district_id = sd.id
      JOIN district d ON sd.district_id = d.id
      JOIN state s ON d.state_id = s.id
      WHERE v.name ILIKE $1
      ORDER BY v.name
      LIMIT 10
      `,
      [`%${q}%`]
    );

    const formatted = result.rows.map(row => ({
  value: row.id,
  label: row.village,
  fullAddress: `${row.village}, ${row.sub_district}, ${row.district}, ${row.state}, India`,
  hierarchy: {
    village: row.village,
    subDistrict: row.sub_district,
    district: row.district,
    state: row.state,
    country: "India"
  }
}));

    const time = Date.now() - start; // ✅ STEP 2: calculate time

    // ✅ STEP 3: log into DB
    await pool.query(
      "INSERT INTO api_logs (api_key, endpoint, response_time) VALUES ($1, $2, $3)",
      [req.headers["x-api-key"], "/v1/autocomplete", 50]
    );

   res.json({
  success: true,
 count: formatted.length,
  data: formatted});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


// ================= ADMIN APIs =================

// Get latest logs
app.get("/admin/logs", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM api_logs ORDER BY created_at DESC LIMIT 50"
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Total requests
app.get("/admin/stats/total-requests", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM api_logs"
    );

    res.json({
      success: true,
      totalRequests: result.rows[0].count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Top endpoints
app.get("/admin/stats/top-endpoints", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT endpoint, COUNT(*) as count
      FROM api_logs
      GROUP BY endpoint
      ORDER BY count DESC
      LIMIT 5
      `
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/v1/analytics", async (req, res) => {
  try {
    // 📊 Last 7 days
    const daily = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as requests
      FROM api_logs
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    // 🔥 Total requests
    const total = await pool.query(`
      SELECT COUNT(*) FROM api_logs
    `);

    // ⚡ Avg response time
    const avg = await pool.query(`
      SELECT AVG(response_time) FROM api_logs
    `);

    // 📅 Today requests
    const today = await pool.query(`
      SELECT COUNT(*) FROM api_logs
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    res.json({
      success: true,
      data: {
        daily: daily.rows,
        total: Number(total.rows[0].count),
        avgResponse: Math.round(avg.rows[0].avg || 0),
        today: Number(today.rows[0].count),
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/v1/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, plan , created_at FROM users ORDER BY created_at DESC"
    );

    res.json({
  success: true,
  count: result.rows.length,
  data: result.rows,
  
});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/v1/apikeys", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, key, created_at FROM api_keys ORDER BY created_at DESC"
    );

    res.json({
  success: true,
  count: result.rows.length,
  data: result.rows,
 
});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.delete("/v1/apikeys/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM api_keys WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "API key revoked successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
const PORT = process.env.PORT || 3000;
// Server start
app.listen(PORT, () => {
  console.log("Server running on port 3000");
});