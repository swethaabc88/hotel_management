const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const pool = require("./db");
const { initDb } = require("./initDb");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, "hotel-" + uniqueSuffix + ext);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedMime = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, JPG, PNG, WebP, GIF, and AVIF images are allowed!"
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB maximum file size
  fileFilter: fileFilter,
});

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));


app.use("/uploads", express.static(uploadDir));


const formatHotel = (hotel) => ({
  ...hotel,
  price: Number(hotel.price),
  rating: Number(hotel.rating),
  reviews: Number(hotel.reviews),
  facilities: Array.isArray(hotel.facilities) ? hotel.facilities : [],
});



app.get("/", (req, res) => {
  res.json({
    message: "StayScape Backend is running successfully 🚀",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const dbRes = await pool.query(
      "SELECT NOW() AS current_time, current_database() AS database, current_user AS user"
    );
    res.json({
      status: "healthy",
      database: "connected",
      dbInfo: dbRes.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
    });
  }
});
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file uploaded",
      });
    }

    const relativePath = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      message: "Image uploaded successfully",
      filename: req.file.filename,
      filePath: relativePath,
      imageUrl: fullUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
});
app.get("/api/hotels", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM hotels ORDER BY id ASC"
    );

    res.json(result.rows.map(formatHotel));
  } catch (error) {
    console.error("Error fetching hotels:", error);

    res.status(500).json({
      message: "Failed to fetch hotels",
      error: error.message,
    });
  }
});
app.get("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json(formatHotel(result.rows[0]));
  } catch (error) {
    console.error("Error fetching hotel:", error);

    res.status(500).json({
      message: "Failed to fetch hotel",
      error: error.message,
    });
  }
});
app.post("/api/hotels", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      location,
      address,
      price,
      description,
      rating,
      reviews,
      image,
      facilities,
    } = req.body;

    if (!title || !location || !price || !description) {
      return res.status(400).json({
        message: "Please fill all required fields (title, location, price, description)",
      });
    }
    let finalImage = "/hotell.jpg";
    if (req.file) {
      finalImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    } else if (image) {
      finalImage = image;
    }

    let facilitiesArray = facilities;
    if (typeof facilities === "string") {
      try {
        facilitiesArray = JSON.parse(facilities);
      } catch {
        facilitiesArray = facilities.split(",").map((s) => s.trim());
      }
    }
    if (!Array.isArray(facilitiesArray)) {
      facilitiesArray = ["Free Wi-Fi", "Parking", "Restaurant"];
    }

    const result = await pool.query(
      `INSERT INTO hotels
      (
        title,
        location,
        address,
        price,
        description,
        rating,
        reviews,
        image,
        facilities
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        location,
        address || "",
        Number(price),
        description,
        Number(rating) || 4.5,
        Number(reviews) || 0,
        finalImage,
        facilitiesArray,
      ]
    );

    res.status(201).json({
      message: "Hotel added successfully",
      hotel: formatHotel(result.rows[0]),
    });
  } catch (error) {
    console.error("Error adding hotel:", error);

    res.status(500).json({
      message: "Failed to add hotel",
      error: error.message,
    });
  }
});
app.put("/api/hotels/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      location,
      address,
      price,
      description,
      rating,
      reviews,
      image,
      facilities,
    } = req.body;
    let finalImage = image;
    if (req.file) {
      finalImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    let facilitiesArray = facilities;
    if (typeof facilities === "string") {
      try {
        facilitiesArray = JSON.parse(facilities);
      } catch {
        facilitiesArray = facilities.split(",").map((s) => s.trim());
      }
    }
    if (!Array.isArray(facilitiesArray)) {
      facilitiesArray = ["Free Wi-Fi", "Parking", "Restaurant"];
    }

    const result = await pool.query(
      `UPDATE hotels
       SET
         title = $1,
         location = $2,
         address = $3,
         price = $4,
         description = $5,
         rating = $6,
         reviews = $7,
         image = COALESCE($8, image),
         facilities = $9
       WHERE id = $10
       RETURNING *`,
      [
        title,
        location,
        address || "",
        Number(price),
        description,
        Number(rating) || 4.5,
        Number(reviews) || 0,
        finalImage || null,
        facilitiesArray,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json({
      message: "Hotel updated successfully",
      hotel: formatHotel(result.rows[0]),
    });
  } catch (error) {
    console.error("Error updating hotel:", error);

    res.status(500).json({
      message: "Failed to update hotel",
      error: error.message,
    });
  }
});
app.delete("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM bookings WHERE hotel_id = $1", [id]);

    const result = await pool.query(
      "DELETE FROM hotels WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json({
      message: "Hotel deleted successfully",
      hotel: formatHotel(result.rows[0]),
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);

    res.status(500).json({
      message: "Failed to delete hotel",
      error: error.message,
    });
  }
});
app.get("/api/search", async (req, res) => {
  try {
    const { search } = req.query;

    const result = await pool.query(
      `SELECT * FROM hotels
       WHERE LOWER(title) LIKE LOWER($1)
       OR LOWER(location) LIKE LOWER($1)
       ORDER BY id ASC`,
      [`%${search || ""}%`]
    );

    res.json(result.rows.map(formatHotel));
  } catch (error) {
    console.error("Error searching hotels:", error);

    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
});
app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      hotelId,
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      rooms,
      roomType,
      specialRequest,
      coupon,
      discount,
      totalPrice,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO bookings
      (
        hotel_id,
        full_name,
        email,
        phone,
        check_in,
        check_out,
        guests,
        rooms,
        room_type,
        special_request,
        coupon,
        discount,
        total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        hotelId ? Number(hotelId) : null,
        fullName || "",
        email || "",
        phone || "",
        checkIn || "",
        checkOut || "",
        Number(guests) || 1,
        Number(rooms) || 1,
        roomType || "Standard Room",
        specialRequest || "",
        coupon || "",
        Number(discount) || 0,
        Number(totalPrice) || 0,
      ]
    );

    res.status(201).json({
      message: "Booking successful",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving booking:", error);

    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
});
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: `File upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
  next();
});
app.listen(PORT, async () => {
  console.log(`🚀 StayScape Backend running on http://localhost:${PORT}`);
  try {
    await initDb();
    const testQuery = await pool.query(
      "SELECT current_database() AS database, current_user AS user"
    );
    console.log(
      `📦 PostgreSQL connected successfully! Database: "${testQuery.rows[0].database}", User: "${testQuery.rows[0].user}"`
    );
  } catch (error) {
    console.error("❌ PostgreSQL initialization failed:", error.message);
  }
});

module.exports = app;