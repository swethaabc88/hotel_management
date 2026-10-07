import { useState } from "react";
import "./App.css";

function App() {
  const [hotels, setHotels] = useState([
    {
      id: 1,
      title: "The Grand Haven",
      image: "/hotell.jpg",
      description:
        "Luxury rooms with premium facilities and beautiful views.",
      price: 4500,
      location: "Coimbatore, Tamil Nadu",
      address: "123 Avinashi Road, Coimbatore, Tamil Nadu",
      latitude: 11.0168,
      longitude: 76.9558,
      rating: 4.8,
      reviews: 245,
      facilities: [
        "Free Wi-Fi",
        "Swimming Pool",
        "Parking",
        "Restaurant",
      ],
    },

    {
      id: 2,
      title: "Royal Palace",
      image: "/image2.jpg",
      description:
        "Elegant rooms with excellent service and modern facilities.",
      price: 3500,
      location: "Chennai, Tamil Nadu",
      address: "45 Marina Road, Chennai, Tamil Nadu",
      latitude: 13.0827,
      longitude: 80.2707,
      rating: 4.6,
      reviews: 198,
      facilities: [
        "Free Wi-Fi",
        "Gym",
        "Parking",
        "Restaurant",
      ],
    },

    {
      id: 3,
      title: "Ocean View Resort",
      image: "/image4.png",
      description:
        "Enjoy a relaxing stay with beautiful ocean views and premium resort facilities.",
      price: 6000,
      location: "Goa, India",
      address: "12 Beach Road, Goa, India",
      latitude: 15.4909,
      longitude: 73.8278,
      rating: 4.9,
      reviews: 312,
      facilities: [
        "Free Wi-Fi",
        "Beach Access",
        "Swimming Pool",
        "Spa",
      ],
    },

    {
      id: 4,
      title: "Green Valley",
      image: "/imageb.webp",
      description:
        "A peaceful hotel surrounded by nature and greenery.",
      price: 2800,
      location: "Ooty, Tamil Nadu",
      address: "78 Botanical Garden Road, Ooty, Tamil Nadu",
      latitude: 11.4102,
      longitude: 76.695,
      rating: 4.5,
      reviews: 156,
      facilities: [
        "Free Wi-Fi",
        "Garden",
        "Parking",
        "Restaurant",
      ],
    },

    {
      id: 5,
      title: "City Star",
      image: "/imagef.jpg",
      description:
        "Modern hotel located near the city with comfortable rooms.",
      price: 4000,
      location: "Bangalore, Karnataka",
      address: "90 MG Road, Bangalore, Karnataka",
      latitude: 12.9716,
      longitude: 77.5946,
      rating: 4.7,
      reviews: 221,
      facilities: [
        "Free Wi-Fi",
        "Gym",
        "Parking",
        "Conference Hall",
      ],
    },

    {
      id: 6,
      title: "Sunset Resort",
      image: "/images.jpg",
      description:
        "Beautiful resort with a peaceful atmosphere and luxury rooms.",
      price: 5500,
      location: "Kochi, Kerala",
      address: "25 Marine Drive, Kochi, Kerala",
      latitude: 9.9312,
      longitude: 76.2673,
      rating: 4.8,
      reviews: 287,
      facilities: [
        "Free Wi-Fi",
        "Swimming Pool",
        "Spa",
        "Restaurant",
      ],
    },
  ]);


  const [search, setSearch] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const HOTELS_PER_SLIDE = 3;
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    title: "",
    location: "",
    address: "",
    latitude: "",
    longitude: "",
    price: "",
    description: "",
    rating: "",
    reviews: "",
    image: "",
  });
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [previewHotel, setPreviewHotel] = useState(null);

  const [wishlist, setWishlist] = useState([]);
  const [compareHotels, setCompareHotels] = useState([]);



  const [showBooking, setShowBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);

  // =========================================
  // COUPON
  // =========================================

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  // =========================================
  // HOTEL FORM CHANGE
  // =========================================

  const handleHotelChange = (e) => {
    const { name, value } = e.target;

    setHotelForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // IMAGE UPLOAD
  // =========================================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setHotelForm((previous) => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const resetHotelForm = () => {
    setHotelForm({
      title: "",
      location: "",
      address: "",
      latitude: "",
      longitude: "",
      price: "",
      description: "",
      rating: "",
      reviews: "",
      image: "",
    });

    setEditingId(null);
    setShowHotelForm(false);
  };


  const addHotel = (e) => {
    e.preventDefault();

    if (
      !hotelForm.title ||
      !hotelForm.location ||
      !hotelForm.price ||
      !hotelForm.description ||
      !hotelForm.latitude ||
      !hotelForm.longitude
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const latitude = Number(hotelForm.latitude);
    const longitude = Number(hotelForm.longitude);

    if (latitude < -90 || latitude > 90) {
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (longitude < -180 || longitude > 180) {
      alert("Longitude must be between -180 and 180.");
      return;
    }

    const newHotel = {
      id: Date.now(),
      title: hotelForm.title,
      location: hotelForm.location,
      address: hotelForm.address,
      latitude,
      longitude,
      price: Number(hotelForm.price),
      description: hotelForm.description,
      rating: Number(hotelForm.rating) || 4.5,
      reviews: Number(hotelForm.reviews) || 0,
      image: hotelForm.image || "/hotell.jpg",
      facilities: [
        "Free Wi-Fi",
        "Parking",
        "Restaurant",
      ],
    };

    setHotels((previous) => [
      ...previous,
      newHotel,
    ]);

    alert("Hotel added successfully!");

    resetHotelForm();


    setCurrentSlide(
      Math.floor(
        (hotels.length) / HOTELS_PER_SLIDE
      )
    );
  };



  const editHotel = (hotel) => {
    setEditingId(hotel.id);

    setHotelForm({
      title: hotel.title,
      location: hotel.location,
      address: hotel.address,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      price: hotel.price,
      description: hotel.description,
      rating: hotel.rating,
      reviews: hotel.reviews,
      image: hotel.image,
    });

    setShowHotelForm(true);

    setTimeout(() => {
      document
        .getElementById("hotel-crud")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };



  const updateHotel = (e) => {
    e.preventDefault();

    if (
      !hotelForm.title ||
      !hotelForm.location ||
      !hotelForm.price ||
      !hotelForm.description ||
      !hotelForm.latitude ||
      !hotelForm.longitude
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const latitude = Number(hotelForm.latitude);
    const longitude = Number(hotelForm.longitude);

    if (latitude < -90 || latitude > 90) {
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (longitude < -180 || longitude > 180) {
      alert("Longitude must be between -180 and 180.");
      return;
    }

    setHotels((previous) =>
      previous.map((hotel) =>
        hotel.id === editingId
          ? {
            ...hotel,
            title: hotelForm.title,
            location: hotelForm.location,
            address: hotelForm.address,
            latitude,
            longitude,
            price: Number(hotelForm.price),
            description: hotelForm.description,
            rating:
              Number(hotelForm.rating) ||
              hotel.rating,
            reviews:
              Number(hotelForm.reviews) ||
              hotel.reviews,
            image:
              hotelForm.image || hotel.image,
          }
          : hotel
      )
    );

    if (selectedHotel?.id === editingId) {
      setSelectedHotel((previous) => ({
        ...previous,
        title: hotelForm.title,
        location: hotelForm.location,
        address: hotelForm.address,
        latitude,
        longitude,
        price: Number(hotelForm.price),
        description: hotelForm.description,
        rating:
          Number(hotelForm.rating) ||
          previous.rating,
        reviews:
          Number(hotelForm.reviews) ||
          previous.reviews,
        image:
          hotelForm.image ||
          previous.image,
      }));
    }

    alert("Hotel updated successfully!");

    resetHotelForm();
  };



  const deleteHotel = (id) => {
    const hotel = hotels.find(
      (item) => item.id === id
    );

    if (!hotel) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${hotel.title}"?`
    );

    if (!confirmDelete) return;

    setHotels((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );

    setWishlist((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );

    setCompareHotels((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );

    if (selectedHotel?.id === id) {
      setSelectedHotel(null);
      setShowBooking(false);
    }

    alert("Hotel deleted successfully!");

    // If last slide becomes empty
    setCurrentSlide((previous) =>
      previous > 0 &&
        (hotels.length - 1) % HOTELS_PER_SLIDE === 0
        ? previous - 1
        : previous
    );
  };



  let filteredHotels = hotels.filter(
    (hotel) =>
      hotel.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      hotel.location
        .toLowerCase()
        .includes(search.toLowerCase())
  );



  if (sortPrice === "low") {
    filteredHotels.sort(
      (a, b) => a.price - b.price
    );
  }

  if (sortPrice === "high") {
    filteredHotels.sort(
      (a, b) => b.price - a.price
    );
  }



  const totalSlides = Math.max(
    1,
    Math.ceil(
      filteredHotels.length /
      HOTELS_PER_SLIDE
    )
  );


  if (currentSlide >= totalSlides) {
    setCurrentSlide(totalSlides - 1);
  }

  const startIndex =
    currentSlide * HOTELS_PER_SLIDE;

  const visibleHotels =
    filteredHotels.slice(
      startIndex,
      startIndex + HOTELS_PER_SLIDE
    );



  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(
        currentSlide + 1
      );

      document
        .getElementById("hotels")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };



  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(
        currentSlide - 1
      );

      document
        .getElementById("hotels")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };



  const goToSlide = (index) => {
    setCurrentSlide(index);

    document
      .getElementById("hotels")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };



  const openPreview = (hotel) => {
    setPreviewHotel(hotel);
  };

  const closePreview = () => {
    setPreviewHotel(null);
  };



  const viewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowBooking(false);
    setBookingSuccess(false);

    setTimeout(() => {
      document
        .getElementById("details")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };



  const openGoogleMaps = (hotel) => {
    const url =
      `https://www.google.com/maps?q=` +
      `${hotel.latitude},${hotel.longitude}`;

    window.open(url, "_blank");
  };

  const toggleWishlist = (hotel) => {
    const alreadyAdded = wishlist.some(
      (item) => item.id === hotel.id
    );

    if (alreadyAdded) {
      setWishlist((previous) =>
        previous.filter(
          (item) => item.id !== hotel.id
        )
      );
    } else {
      setWishlist((previous) => [
        ...previous,
        hotel,
      ]);
    }
  };

  const isInWishlist = (hotelId) => {
    return wishlist.some(
      (hotel) => hotel.id === hotelId
    );
  };



  const toggleCompare = (hotel) => {
    const alreadyAdded = compareHotels.some(
      (item) => item.id === hotel.id
    );

    if (alreadyAdded) {
      setCompareHotels((previous) =>
        previous.filter(
          (item) => item.id !== hotel.id
        )
      );

      return;
    }

    if (compareHotels.length >= 3) {
      alert(
        "You can compare maximum 3 hotels."
      );
      return;
    }

    setCompareHotels((previous) => [
      ...previous,
      hotel,
    ]);
  };

  const isInCompare = (hotelId) => {
    return compareHotels.some(
      (hotel) => hotel.id === hotelId
    );
  };



  const openBooking = () => {
    setShowBooking(true);
    setBookingSuccess(false);
    setCheckIn("");
    setCheckOut("");
    setRooms(1);
    setCoupon("");
    setDiscount(0);
    setCouponMessage("");
  };

  const closeBooking = () => {
    setShowBooking(false);
    setBookingSuccess(false);
  };



  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 1;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference =
      endDate.getTime() -
      startDate.getTime();

    const calculatedNights = Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

    if (calculatedNights <= 0) {
      return 1;
    }

    return calculatedNights;
  };

  const nights = calculateNights();



  const roomPrice = selectedHotel
    ? selectedHotel.price
    : 0;

  const subtotal =
    roomPrice *
    nights *
    rooms;

  const discountAmount =
    (subtotal * discount) / 100;

  const amountAfterDiscount =
    subtotal - discountAmount;

  const tax =
    amountAfterDiscount * 0.1;

  const totalPrice =
    amountAfterDiscount + tax;



  const applyCoupon = () => {
    const code =
      coupon.trim().toUpperCase();

    if (code === "STAY20") {
      setDiscount(20);

      setCouponMessage(
        "🎉 STAY20 applied! You got 20% OFF."
      );
    } else if (code === "HOTEL10") {
      setDiscount(10);

      setCouponMessage(
        "🎉 HOTEL10 applied! You got 10% OFF."
      );
    } else {
      setDiscount(0);

      setCouponMessage(
        "❌ Invalid coupon code."
      );
    }
  };



  const confirmBooking = (event) => {
    event.preventDefault();

    if (
      checkIn &&
      checkOut &&
      new Date(checkOut) <=
      new Date(checkIn)
    ) {
      alert(
        "Check-out date must be after check-in date."
      );
      return;
    }

    setBookingSuccess(true);
  };



  return (
    <div className="page">

      { }

      <nav className="navbar">

        <h1 className="logo">
          StayScape
        </h1>

        <div className="links">

          <a href="#home">
            HOME
          </a>

          <a href="#hotels">
            HOTELS
          </a>

          <a href="#hotel-crud">
            MANAGE HOTELS
          </a>

          <a href="#wishlist">
            ❤️ Wishlist ({wishlist.length})
          </a>

          <a href="#compare">
            🏆 Compare ({compareHotels.length})
          </a>

          <a href="#contact">
            CONTACT
          </a>

        </div>

      </nav>

      {/* =====================================
          HERO
      ====================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <h1>
            Find Your Perfect Stay
          </h1>

          <p>
            Discover comfortable hotels
            and beautiful resorts for your
            perfect vacation.
          </p>

          <a
            href="#hotels"
            className="hero-btn"
          >
            Explore Hotels
          </a>

        </div>

      </section>

      { }

      <section
        className="crud-section"
        id="hotel-crud"
      >

        <div className="crud-header">

          <div>

            <h2>
              🏨 Hotel Management
            </h2>

            <p>
              Create, Read, Update and Delete
              hotel records.
            </p>

          </div>

          {!showHotelForm && (
            <button
              className="add-hotel-btn"
              onClick={() => {
                resetHotelForm();
                setShowHotelForm(true);
              }}
            >
              + Add New Hotel
            </button>
          )}

        </div>

        { }

        {showHotelForm && (

          <div className="crud-form-card">

            <h2>
              {editingId
                ? "✏️ Edit Hotel"
                : "➕ Add New Hotel"}
            </h2>

            <form
              onSubmit={
                editingId
                  ? updateHotel
                  : addHotel
              }
            >

              <div className="crud-form-grid">

                <div>
                  <label>
                    Hotel Name *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={hotelForm.title}
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Enter hotel name"
                    required
                  />
                </div>

                <div>
                  <label>
                    Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      hotelForm.location
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div>
                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      hotelForm.address
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label>
                    Latitude *
                  </label>

                  <input
                    type="number"
                    name="latitude"
                    value={
                      hotelForm.latitude
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Example: 11.0168"
                    min="-90"
                    max="90"
                    step="any"
                    required
                  />

                  <small>
                    Range: -90 to 90
                  </small>
                </div>

                <div>
                  <label>
                    Longitude *
                  </label>

                  <input
                    type="number"
                    name="longitude"
                    value={
                      hotelForm.longitude
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Example: 76.9558"
                    min="-180"
                    max="180"
                    step="any"
                    required
                  />

                  <small>
                    Range: -180 to 180
                  </small>
                </div>

                <div>
                  <label>
                    Price Per Night *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={hotelForm.price}
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label>
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    value={
                      hotelForm.rating
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Example: 4.5"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                <div>
                  <label>
                    Reviews
                  </label>

                  <input
                    type="number"
                    name="reviews"
                    value={
                      hotelForm.reviews
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="Number of reviews"
                    min="0"
                  />
                </div>

              </div>

              <div className="crud-full-field">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    hotelForm.description
                  }
                  onChange={
                    handleHotelChange
                  }
                  placeholder="Enter hotel description"
                  rows="4"
                  required
                ></textarea>

              </div>

              <div className="crud-full-field">

                <label>
                  Hotel Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                />

              </div>

              {hotelForm.image && (

                <div className="image-preview">

                  <img
                    src={hotelForm.image}
                    alt="Preview"
                  />

                </div>

              )}

              <div className="crud-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingId
                    ? "Update Hotel"
                    : "Add Hotel"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    resetHotelForm
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}

        { }

        <div className="crud-table-wrapper">

          <table className="crud-table">

            <thead>

              <tr>

                <th>Image</th>
                <th>Hotel</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {hotels.map((hotel) => (

                <tr key={hotel.id}>

                  <td>

                    <img
                      className="table-image"
                      src={hotel.image}
                      alt={hotel.title}
                    />

                  </td>

                  <td>
                    <strong>
                      {hotel.title}
                    </strong>
                  </td>

                  <td>
                    {hotel.location}
                  </td>

                  <td>
                    {hotel.latitude}
                  </td>

                  <td>
                    {hotel.longitude}
                  </td>

                  <td>
                    ₹
                    {hotel.price.toLocaleString()}
                  </td>

                  <td>
                    ⭐ {hotel.rating}
                  </td>

                  <td>

                    <div className="crud-action-buttons">

                      <button
                        className="preview-btn"
                        onClick={() =>
                          openPreview(hotel)
                        }
                      >
                        👁️ Preview
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editHotel(hotel)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteHotel(hotel.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      { }

      <section
        className="hotel-section"
        id="hotels"
      >

        <div className="hotel-heading">

          <h2>
            Our Hotels
          </h2>

          <p>
            Explore our best hotels and resorts
          </p>

        </div>

        { }

        <div className="search-area">

          <input
            type="text"
            placeholder="🔍 Search hotel by name or location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentSlide(0);
            }}
          />

          <select
            value={sortPrice}
            onChange={(e) => {
              setSortPrice(e.target.value);
              setCurrentSlide(0);
            }}
          >

            <option value="">
              Sort by Price
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

          </select>

        </div>

        { }

        <div className="slide-info">

          <span>
            Showing{" "}
            {visibleHotels.length}{" "}
            hotels
          </span>

          <strong>
            Slide {currentSlide + 1} /{" "}
            {totalSlides}
          </strong>

        </div>

        { }

        <div className="hotel-grid">

          {visibleHotels.length > 0 ? (

            visibleHotels.map((hotel) => (

              <div
                className="hotel-card"
                key={hotel.id}
              >

                { }

                <div className="hotel-image-wrapper">

                  <img
                    src={hotel.image}
                    alt={hotel.title}
                  />

                  <button
                    className="wishlist-button"
                    onClick={() =>
                      toggleWishlist(hotel)
                    }
                  >
                    {isInWishlist(
                      hotel.id
                    )
                      ? "❤️"
                      : "♡"}
                  </button>

                </div>

                { }

                <div className="hotel-content">

                  <h3>
                    {hotel.title}
                  </h3>

                  <p className="location">
                    📍 {hotel.location}
                  </p>

                  <p className="description">
                    {hotel.description}
                  </p>

                  <div className="rating">
                    ⭐ {hotel.rating}
                    {" "}
                    ({hotel.reviews} reviews)
                  </div>

                  { }

                  <div className="coordinates">

                    <p>
                      🌐 Latitude:
                      {" "}
                      {hotel.latitude}
                    </p>

                    <p>
                      🌐 Longitude:
                      {" "}
                      {hotel.longitude}
                    </p>

                  </div>

                  { }

                  <div className="facilities">

                    {hotel.facilities.map(
                      (facility, index) => (

                        <span key={index}>
                          ✓ {facility}
                        </span>

                      )
                    )}

                  </div>

                  { }

                  <div className="card-bottom">

                    <div>

                      <small>
                        Price per night
                      </small>

                      <h3>
                        ₹
                        {hotel.price.toLocaleString()}
                      </h3>

                    </div>

                  </div>

                  { }

                  <button
                    className={
                      isInCompare(
                        hotel.id
                      )
                        ? "compare-button selected"
                        : "compare-button"
                    }
                    onClick={() =>
                      toggleCompare(hotel)
                    }
                  >
                    {isInCompare(
                      hotel.id
                    )
                      ? "✓ Added to Compare"
                      : "🏆 Add to Compare"}
                  </button>

                  { }

                  <button
                    className="view-button"
                    onClick={() =>
                      viewDetails(hotel)
                    }
                  >
                    View Details
                  </button>

                  { }

                  <button
                    className="map-button"
                    onClick={() =>
                      openGoogleMaps(hotel)
                    }
                  >
                    📍 Open in Google Maps
                  </button>

                  { }

                  <div className="card-crud-actions">

                    <button
                      onClick={() =>
                        openPreview(hotel)
                      }
                    >
                      👁️ Preview
                    </button>

                    <button
                      onClick={() =>
                        editHotel(hotel)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteHotel(hotel.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="no-result-box">

              <h3>
                😔 No hotels found
              </h3>

              <p>
                Try another hotel name
                or location.
              </p>

            </div>

          )}

        </div>

        { }

        {filteredHotels.length > 0 && (

          <div className="slider-controls">

            <button
              className="slider-arrow"
              onClick={previousSlide}
              disabled={
                currentSlide === 0
              }
            >
              ← Previous
            </button>

            <div className="slider-dots">

              {Array.from(
                { length: totalSlides },
                (_, index) => (

                  <button
                    key={index}
                    className={
                      currentSlide === index
                        ? "slider-dot active"
                        : "slider-dot"
                    }
                    onClick={() =>
                      goToSlide(index)
                    }
                    aria-label={`Go to slide ${index + 1
                      }`}
                  ></button>

                )
              )}

            </div>

            <button
              className="slider-arrow"
              onClick={nextSlide}
              disabled={
                currentSlide ===
                totalSlides - 1
              }
            >
              Next →
            </button>

          </div>

        )}

      </section>

      { }

      {wishlist.length > 0 && (

        <section
          className="wishlist-section"
          id="wishlist"
        >

          <h2>
            ❤️ My Wishlist
          </h2>

          <div className="wishlist-grid">

            {wishlist.map((hotel) => (

              <div
                className="wishlist-card"
                key={hotel.id}
              >

                <img
                  src={hotel.image}
                  alt={hotel.title}
                />

                <div className="wishlist-info">

                  <h3>
                    {hotel.title}
                  </h3>

                  <p>
                    📍 {hotel.location}
                  </p>

                  <p>
                    🌐 {hotel.latitude},{" "}
                    {hotel.longitude}
                  </p>

                  <strong>
                    ₹
                    {hotel.price.toLocaleString()}
                    {" "}
                    / night
                  </strong>

                  <div className="wishlist-actions">

                    <button
                      onClick={() =>
                        viewDetails(hotel)
                      }
                    >
                      View Hotel
                    </button>

                    <button
                      className="remove-wishlist"
                      onClick={() =>
                        toggleWishlist(hotel)
                      }
                    >
                      Remove ❤️
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

      )}

      { }
      {compareHotels.length > 0 && (
        <section
          className="compare-section"
          id="compare"
        >

          <h2>
            🏆 Compare Hotels
          </h2>

          <p className="compare-subtitle">
            Compare up to 3 hotels before
            booking.
          </p>

          <div className="compare-table-wrapper">

            <table className="compare-table">

              <thead>

                <tr>

                  <th>
                    Feature
                  </th>

                  {compareHotels.map(
                    (hotel) => (

                      <th key={hotel.id}>
                        {hotel.title}
                      </th>

                    )
                  )}

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>
                    Location
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        📍 {hotel.location}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Latitude
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        {hotel.latitude}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Longitude
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        {hotel.longitude}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Price
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        ₹
                        {hotel.price.toLocaleString()}
                        {" "}
                        / night
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Rating
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        ⭐ {hotel.rating}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Reviews
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        {hotel.reviews}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Free Wi-Fi
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        {hotel.facilities.includes(
                          "Free Wi-Fi"
                        )
                          ? "✅"
                          : "❌"}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Swimming Pool
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        {hotel.facilities.includes(
                          "Swimming Pool"
                        )
                          ? "✅"
                          : "❌"}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Parking
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        {hotel.facilities.includes(
                          "Parking"
                        )
                          ? "✅"
                          : "❌"}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Restaurant
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>
                        {hotel.facilities.includes(
                          "Restaurant"
                        )
                          ? "✅"
                          : "❌"}
                      </td>

                    )
                  )}

                </tr>

                <tr>

                  <td>
                    Action
                  </td>

                  {compareHotels.map(
                    (hotel) => (

                      <td key={hotel.id}>

                        <button
                          className="remove-compare"
                          onClick={() =>
                            toggleCompare(
                              hotel
                            )
                          }
                        >
                          Remove
                        </button>

                      </td>

                    )
                  )}

                </tr>

              </tbody>

            </table>

          </div>

        </section>

      )}

      { }

      {previewHotel && (

        <div
          className="preview-overlay"
          onClick={closePreview}
        >

          <div
            className="preview-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="preview-close"
              onClick={closePreview}
            >
              ✕
            </button>

            <div className="preview-image-box">

              <img
                src={previewHotel.image}
                alt={previewHotel.title}
              />

            </div>

            <div className="preview-content">

              <span className="preview-label">
                HOTEL PREVIEW
              </span>

              <h2>
                {previewHotel.title}
              </h2>

              <p className="preview-location">
                📍 {previewHotel.location}
              </p>

              <p className="preview-description">
                {previewHotel.description}
              </p>

              <div className="preview-info-grid">

                <div>
                  <span>
                    ⭐ Rating
                  </span>

                  <strong>
                    {previewHotel.rating}/5
                  </strong>
                </div>

                <div>
                  <span>
                    💬 Reviews
                  </span>

                  <strong>
                    {previewHotel.reviews}
                  </strong>
                </div>

                <div>
                  <span>
                    💰 Price
                  </span>

                  <strong>
                    ₹
                    {previewHotel.price.toLocaleString()}
                  </strong>
                </div>

              </div>

              <h3>
                📍 Address
              </h3>

              <p>
                {previewHotel.address ||
                  "Address not available"}
              </p>

              <h3>
                🌐 Location Coordinates
              </h3>

              <div className="coordinate-box">

                <p>
                  <strong>
                    Latitude:
                  </strong>{" "}
                  {previewHotel.latitude}
                </p>

                <p>
                  <strong>
                    Longitude:
                  </strong>{" "}
                  {previewHotel.longitude}
                </p>

              </div>

              <button
                className="map-button"
                onClick={() =>
                  openGoogleMaps(
                    previewHotel
                  )
                }
              >
                📍 Open Location in
                Google Maps
              </button>

              <h3>
                ✨ Facilities
              </h3>

              <div className="preview-facilities">

                {previewHotel.facilities?.map(
                  (facility, index) => (

                    <span key={index}>
                      ✓ {facility}
                    </span>

                  )
                )}

              </div>

              <div className="preview-actions">

                <button
                  className="preview-book-btn"
                  onClick={() => {
                    closePreview();
                    viewDetails(
                      previewHotel
                    );
                  }}
                >
                  View Details & Book
                </button>

                <button
                  className="preview-edit-btn"
                  onClick={() => {
                    closePreview();
                    editHotel(
                      previewHotel
                    );
                  }}
                >
                  ✏️ Edit Hotel
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      { }
      {selectedHotel && (
        <section
          className="details-section"
          id="details"
        >
          <h2>
            Hotel Details
          </h2>
          <div className="details-card">
            <img
              className="details-main-image"
              src={selectedHotel.image}
              alt={selectedHotel.title}
            />
            <div className="details-content">
              <h1>
                {selectedHotel.title}
              </h1>
              <p className="details-location">
                📍 {selectedHotel.location}
              </p>

              <p>
                {selectedHotel.description}
              </p>

              <div className="rating-large">

                ⭐ {selectedHotel.rating}

                <span>
                  ({selectedHotel.reviews} Reviews)
                </span>

              </div>

              <h3>
                Address
              </h3>

              <p>
                {selectedHotel.address}
              </p>

              <h3>
                🌐 Location Coordinates
              </h3>

              <div className="coordinate-box">

                <p>
                  <strong>
                    Latitude:
                  </strong>{" "}
                  {selectedHotel.latitude}
                </p>

                <p>
                  <strong>
                    Longitude:
                  </strong>{" "}
                  {selectedHotel.longitude}
                </p>

              </div>

              <button
                className="map-button"
                onClick={() =>
                  openGoogleMaps(
                    selectedHotel
                  )
                }
              >
                📍 View Location on
                Google Maps
              </button>

              <h3>
                Facilities
              </h3>

              <div className="facilities">

                {selectedHotel.facilities.map(
                  (facility, index) => (

                    <span key={index}>
                      ✓ {facility}
                    </span>

                  )
                )}

              </div>

              <div className="booking-price">

                <div>

                  <small>
                    Price per night
                  </small>

                  <h2>
                    ₹
                    {selectedHotel.price.toLocaleString()}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={openBooking}
                >
                  Book This Hotel
                </button>

              </div>

            </div>

          </div>
          { }
          {showBooking && (

            <div className="booking-form">

              {!bookingSuccess ? (

                <>

                  <div className="booking-header">

                    <h2>
                      🏨 Book Your Stay
                    </h2>

                    <p className="booking-hotel">
                      {selectedHotel.title}
                    </p>

                    <p className="booking-location">
                      📍 {selectedHotel.location}
                    </p>

                  </div>

                  <form
                    onSubmit={
                      confirmBooking
                    }
                  >

                    <div className="form-group">

                      <label>
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Enter your name"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Email
                      </label>

                      <input
                        type="email"
                        placeholder="Enter your email"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        required
                      />

                    </div>

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Check-in
                        </label>

                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) =>
                            setCheckIn(
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Check-out
                        </label>

                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) =>
                            setCheckOut(
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>

                    </div>

                    <div className="form-group">

                      <label>
                        Number of Guests
                      </label>

                      <select required>

                        <option value="">
                          Select Guests
                        </option>

                        <option value="1">
                          1 Guest
                        </option>

                        <option value="2">
                          2 Guests
                        </option>

                        <option value="3">
                          3 Guests
                        </option>

                        <option value="4">
                          4 Guests
                        </option>

                        <option value="5">
                          5+ Guests
                        </option>

                      </select>

                    </div>

                    <div className="form-group">

                      <label>
                        Number of Rooms
                      </label>

                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={rooms}
                        onChange={(e) =>
                          setRooms(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Room Type
                      </label>

                      <select required>

                        <option value="">
                          Select Room
                        </option>

                        <option value="standard">
                          Standard Room
                        </option>

                        <option value="deluxe">
                          Deluxe Room
                        </option>

                        <option value="suite">
                          Suite Room
                        </option>

                      </select>

                    </div>

                    <div className="form-group">

                      <label>
                        Special Request
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Any special request?"
                      ></textarea>

                    </div>

                    { }

                    <div className="coupon-box">

                      <h3>
                        🎁 Apply Coupon
                      </h3>

                      <div className="coupon-row">

                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={coupon}
                          onChange={(e) =>
                            setCoupon(
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={
                            applyCoupon
                          }
                        >
                          Apply
                        </button>

                      </div>

                      <p className="coupon-hint">

                        Try:{" "}
                        <strong>
                          STAY20
                        </strong>{" "}
                        or{" "}
                        <strong>
                          HOTEL10
                        </strong>

                      </p>

                      {couponMessage && (

                        <p className="coupon-message">
                          {couponMessage}
                        </p>

                      )}

                    </div>

                    { }

                    <div className="calculator-box">

                      <h3>
                        🧮 Price Calculator
                      </h3>

                      <div className="price-line">

                        <span>
                          Price per night
                        </span>

                        <strong>
                          ₹
                          {roomPrice.toLocaleString()}
                        </strong>

                      </div>

                      <div className="price-line">

                        <span>
                          Number of nights
                        </span>

                        <strong>
                          {nights}
                        </strong>

                      </div>

                      <div className="price-line">

                        <span>
                          Number of rooms
                        </span>

                        <strong>
                          {rooms}
                        </strong>

                      </div>

                      <div className="price-line">

                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {subtotal.toLocaleString()}
                        </strong>

                      </div>

                      {discount > 0 && (

                        <div className="price-line discount-line">

                          <span>
                            Discount ({discount}%)
                          </span>

                          <strong>
                            -₹
                            {discountAmount.toLocaleString()}
                          </strong>

                        </div>

                      )}

                      <div className="price-line">

                        <span>
                          Tax (10%)
                        </span>

                        <strong>
                          ₹
                          {tax.toLocaleString()}
                        </strong>

                      </div>

                      <div className="total-line">

                        <span>
                          Total Price
                        </span>

                        <strong>
                          ₹
                          {totalPrice.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 0,
                            }
                          )}
                        </strong>

                      </div>

                    </div>

                    <div className="booking-buttons">

                      <button type="submit">
                        Confirm Booking
                      </button>

                      <button
                        type="button"
                        className="cancel"
                        onClick={
                          closeBooking
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </form>

                </>

              ) : (

                <div className="success-box">

                  <div className="success-icon">
                    ✓
                  </div>

                  <h2>
                    Booked Successfully!
                  </h2>

                  <p>
                    Your hotel booking has
                    been confirmed successfully.
                  </p>

                  <div className="success-details">

                    <p>
                      🏨{" "}
                      <strong>
                        {selectedHotel.title}
                      </strong>
                    </p>

                    <p>
                      📍{" "}
                      {selectedHotel.location}
                    </p>

                    <p>
                      🏠{" "}
                      {selectedHotel.address}
                    </p>

                    <p>
                      🌐 Latitude:{" "}
                      {selectedHotel.latitude}
                    </p>

                    <p>
                      🌐 Longitude:{" "}
                      {selectedHotel.longitude}
                    </p>

                    <p>
                      📅 Nights: {nights}
                    </p>

                    <p>
                      🛏️ Rooms: {rooms}
                    </p>

                    {discount > 0 && (

                      <p>
                        🎁 Discount:{" "}
                        {discount}%
                      </p>

                    )}

                    <p>
                      💰{" "}
                      <strong>
                        ₹
                        {totalPrice.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </strong>
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowBooking(false);
                      setBookingSuccess(false);
                    }}
                  >
                    Done
                  </button>

                </div>

              )}

            </div>
          )}
        </section>
      )}
      { }
      <footer id="contact">
        <h2>
          StayScape
        </h2>
        <p>
          Your perfect stay starts here.
        </p>
        <p>
          © 2026 StayScape.
          All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
export default App;