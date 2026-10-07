const pool = require("./db");

const initialHotels = [
  {
    title: "The Grand Haven",
    location: "Coimbatore, Tamil Nadu",
    address: "123 Avinashi Road, Coimbatore, Tamil Nadu",
    price: 4500,
    description: "Luxury rooms with premium facilities and beautiful views.",
    rating: 4.8,
    reviews: 245,
    image: "/hotell.jpg",
    facilities: ["Free Wi-Fi", "Swimming Pool", "Parking", "Restaurant"],
  },
  {
    title: "Royal Palace",
    location: "Chennai, Tamil Nadu",
    address: "45 Marina Road, Chennai, Tamil Nadu",
    price: 3500,
    description: "Elegant rooms with excellent service and modern facilities.",
    rating: 4.6,
    reviews: 198,
    image: "/image2.jpg",
    facilities: ["Free Wi-Fi", "Gym", "Parking", "Restaurant"],
  },
  {
    title: "Ocean View Resort",
    location: "Goa, India",
    address: "12 Beach Road, Goa, India",
    price: 6000,
    description: "Enjoy a relaxing stay with beautiful ocean views.",
    rating: 4.9,
    reviews: 312,
    image: "/image4.png",
    facilities: ["Free Wi-Fi", "Beach Access", "Swimming Pool", "Spa"],
  },
  {
    title: "Green Valley",
    location: "Ooty, Tamil Nadu",
    address: "78 Botanical Garden Road, Ooty, Tamil Nadu",
    price: 2800,
    description: "A peaceful hotel surrounded by nature and greenery.",
    rating: 4.5,
    reviews: 156,
    image: "/imageb.webp",
    facilities: ["Free Wi-Fi", "Garden", "Parking", "Restaurant"],
  },
  {
    title: "City Star",
    location: "Bangalore, Karnataka",
    address: "90 MG Road, Bangalore, Karnataka",
    price: 4000,
    description: "Modern hotel located near the city with comfortable rooms.",
    rating: 4.7,
    reviews: 221,
    image: "/imagef.jpg",
    facilities: ["Free Wi-Fi", "Gym", "Parking", "Conference Hall"],
  },
  {
    title: "Sunset Resort",
    location: "Kochi, Kerala",
    address: "25 Marine Drive, Kochi, Kerala",
    price: 5500,
    description: "Beautiful resort with a peaceful atmosphere and luxury rooms.",
    rating: 4.8,
    reviews: 287,
    image: "/images.jpg",
    facilities: ["Free Wi-Fi", "Swimming Pool", "Spa", "Restaurant"],
  },
];

async function initDb() {
  const client = await pool.connect();
  try {
    console.log("🔄 Verifying database tables...");


    await client.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        address TEXT,
        price NUMERIC NOT NULL,
        description TEXT NOT NULL,
        rating NUMERIC DEFAULT 4.5,
        reviews INTEGER DEFAULT 0,
        image TEXT,
        facilities TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);


    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER,
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        check_in VARCHAR(50),
        check_out VARCHAR(50),
        guests INTEGER DEFAULT 1,
        rooms INTEGER DEFAULT 1,
        room_type VARCHAR(100),
        special_request TEXT,
        coupon VARCHAR(50),
        discount NUMERIC DEFAULT 0,
        total_price NUMERIC DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);


    const { rows } = await client.query("SELECT COUNT(*) AS count FROM hotels");
    if (parseInt(rows[0].count, 10) === 0) {
      console.log("🌱 Seeding initial hotels data into PostgreSQL...");
      for (const hotel of initialHotels) {
        await client.query(
          `INSERT INTO hotels
          (title, location, address, price, description, rating, reviews, image, facilities)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            hotel.title,
            hotel.location,
            hotel.address,
            hotel.price,
            hotel.description,
            hotel.rating,
            hotel.reviews,
            hotel.image,
            hotel.facilities,
          ]
        );
      }
      console.log("✅ Seeded initial hotels successfully.");
    }

    console.log("✅ PostgreSQL schema is ready.");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { initDb };
