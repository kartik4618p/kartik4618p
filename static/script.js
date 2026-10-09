// Predefined login credentials
const validUsername = "admin";
const validPassword = "12345";
// Check if user is already logged in on page load
window.addEventListener("DOMContentLoaded", function() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  
  if (isLoggedIn === "true") {
    // User is already logged in, show main content
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    loadRandomBooks();
  }
});
// Login functionality
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  if (username === validUsername && password === validPassword) {
    // Save login state to localStorage
    localStorage.setItem("isLoggedIn", "true");
    
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    loadRandomBooks();
  } else {
    errorMsg.textContent = "Invalid username or password!";
  }
});
// Logout functionality
function logout() {
  // Clear login state from localStorage
  localStorage.removeItem("isLoggedIn");
  
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("errorMsg").textContent = "";
}
// Fetch Wikipedia description for a book
async function fetchWikipediaDescription(title, author) {
  try {
    // Clean title for Wikipedia search (remove special characters, handle spaces)
    const cleanTitle = title.replace(/[()]/g, "").trim();
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`;
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
      // Check if we got a valid extract (not a disambiguation page)
      if (data.extract && data.extract.length > 50 && !data.type) {
        // Return first 150 characters of Wikipedia description
        return data.extract.substring(0, 150) + "...";
      }
    }
  } catch (error) {
    // Wikipedia API failed, will use fallback
    // Silently fail - fallback description will be used
  }
  return null;
}
// Generate a small fallback description when Wikipedia is not available
function generateFallbackDescription(book) {
  const title = book.title || "This book";
  const author = book.author_name ? book.author_name[0] : "an author";
  const firstPublishYear = book.first_publish_year;
  const subject = book.subject && book.subject.length > 0 ? book.subject[0] : null;
  
  let description = `${title} by ${author}`;
  
  if (firstPublishYear) {
    description += `, published in ${firstPublishYear}`;
  }
  
  if (subject) {
    description += `. A ${subject.toLowerCase()} novel`;
  } else {
    description += `. An engaging literary work`;
  }
  
  return description;
}
// Generate random prices for rent and buy
function generatePrices() {
  // Generate rent price: 50 to 200 in increments of 10
  const rentMin = 50;
  const rentMax = 200;
  const rentStep = 10;
  const rentOptions = Math.floor((rentMax - rentMin) / rentStep) + 1;
  const rentPrice = rentMin + Math.floor(Math.random() * rentOptions) * rentStep;
  // Generate buy price: 200 to 350 in increments of 10, but ensure buy >= rent
  const buyMin = Math.max(200, rentPrice); // Ensure buy is at least 200, and at least equal to rent
  const buyMax = 350;
  const buyStep = 10;
  const buyOptions = Math.floor((buyMax - buyMin) / buyStep) + 1;
  const buyPrice = buyMin + Math.floor(Math.random() * buyOptions) * buyStep;
  
  return { rentPrice, buyPrice };
}
// Generate random person details
function generateRandomPersonDetails() {
  const firstNames = ["Raj", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rahul", "Kavita", "Suresh", "Meera", "Arjun", "Divya", "Karan", "Pooja", "Rohan", "Neha"];
  const lastNames = ["Sharma", "Patel", "Kumar", "Singh", "Gupta", "Verma", "Yadav", "Reddy", "Joshi", "Malhotra", "Agarwal", "Mehta", "Shah", "Desai", "Nair", "Rao"];
  const streets = ["MG Road", "Park Street", "Main Street", "Gandhi Nagar", "Nehru Colony", "Indira Nagar", "Rajiv Nagar", "Vijay Nagar", "Shanti Nagar", "Prem Nagar"];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  // Generate mobile number (10 digits starting with 6-9)
  const mobile = `9${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 90000000) + 10000000}`;
  // Generate address
  const streetNumber = Math.floor(Math.random() * 999) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const address = `${streetNumber}, ${street}, ${city}`;
  // Generate pincode (6 digits)
  const pincode = Math.floor(Math.random() * 900000) + 100000;
  return { name, mobile, address, pincode };
}
// Show person details modal
function showPersonDetailsModal(personDetails, action, price) {
  // Remove existing modal if any
  const existingModal = document.getElementById("personDetailsModal");
  if (existingModal) {
    existingModal.remove();
  }
  // Create modal
  const modal = document.createElement("div");
  modal.id = "personDetailsModal";
  modal.className = "person-modal";
  modal.innerHTML = `
    <div class="person-modal-content">
      <span class="person-modal-close">&times;</span>
      <h2>${action} Details</h2>
      <div class="person-details">
        <p><strong>Name:</strong> ${personDetails.name}</p>
        <p><strong>Mobile:</strong> ${personDetails.mobile}</p>
        <p><strong>Address:</strong> ${personDetails.address}</p>
        <p><strong>Pincode:</strong> ${personDetails.pincode}</p>
        <p class="price-info"><strong>Price:</strong> ₹${price}</p>
      </div>
      <button class="close-modal-btn">Close</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  // Close modal on X click
  modal.querySelector(".person-modal-close").addEventListener("click", () => {
    modal.remove();
  });
  // Close modal on Close button click
  modal.querySelector(".close-modal-btn").addEventListener("click", () => {
    modal.remove();
  });
  // Close modal on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
// Load 25 random books
async function loadRandomBooks() {
  const resultsDiv = document.getElementById("bookGrid");
  resultsDiv.innerHTML = "<p>Loading books...</p>";
  try {
    const response = await fetch("https://openlibrary.org/search.json?q=fiction&limit=100");
    const data = await response.json();
    resultsDiv.innerHTML = "";
    const randomBooks = data.docs.sort(() => 0.5 - Math.random()).slice(0, 25);
    // Process books and fetch descriptions
    for (const book of randomBooks) {
      const title = book.title || "No title";
      const author = book.author_name ? book.author_name.join(", ") : "Unknown author";
      const coverId = book.cover_i;
      const coverUrl = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/150x200?text=No+Cover";

      // Try to get Wikipedia description, fallback to generated description
      let description = await fetchWikipediaDescription(title, author);
      if (!description) {
        description = generateFallbackDescription(book);
      }
      // Generate random prices
      const { rentPrice, buyPrice } = generatePrices();
            // Generate random person details for this card (same details for both rent and buy)
      const personDetails = generateRandomPersonDetails();
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <img src="${coverUrl}" alt="Book cover">
        <h3>${title}</h3>
        <p><strong>${author}</strong></p>
        <p>${description}</p>
        <div class="btn-group">
          <button class="rent" data-rent-price="${rentPrice}">Rent ₹${rentPrice}</button>
          <button class="buy" data-buy-price="${buyPrice}">Buy ₹${buyPrice}</button>
        </div>
      `;
      // Store person details in the card element
      card.dataset.personName = personDetails.name;
      card.dataset.personMobile = personDetails.mobile;
      card.dataset.personAddress = personDetails.address;
      card.dataset.personPincode = personDetails.pincode;
      // Add click handlers to buttons
      const rentBtn = card.querySelector(".rent");
      const buyBtn = card.querySelector(".buy");
      
      rentBtn.addEventListener("click", () => {
        const details = {
          name: card.dataset.personName,
          mobile: card.dataset.personMobile,
          address: card.dataset.personAddress,
          pincode: card.dataset.personPincode
        };
        showPersonDetailsModal(details, "Rent", rentPrice);
      });
      buyBtn.addEventListener("click", () => {
        const details = {
          name: card.dataset.personName,
          mobile: card.dataset.personMobile,
          address: card.dataset.personAddress,
          pincode: card.dataset.personPincode
        };
        showPersonDetailsModal(details, "Buy", buyPrice);
      });
      
      resultsDiv.appendChild(card);
    }
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error loading books.</p>";
    console.error(error);
  }
}
// Search functionality
document.getElementById("searchForm")?.addEventListener("submit", async function(event) {
  event.preventDefault();
  const query = document.getElementById("searchInput").value;
  const resultsDiv = document.getElementById("bookGrid");
  resultsDiv.innerHTML = "<p>Searching...</p>";

  try {
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=25`);
    const data = await response.json();

    resultsDiv.innerHTML = "";
    if (data.docs.length === 0) {
      resultsDiv.innerHTML = "<p>No books found.</p>";
      return;
    }
    // Process books and fetch descriptions
    for (const book of data.docs.slice(0, 25)) {
      const title = book.title || "No title";
      const author = book.author_name ? book.author_name.join(", ") : "Unknown author";
      const coverId = book.cover_i;
      const coverUrl = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/150x200?text=No+Cover";

      // Try to get Wikipedia description, fallback to generated description
      let description = await fetchWikipediaDescription(title, author);
      if (!description) {
        description = generateFallbackDescription(book);
      }

      // Generate random prices
      const { rentPrice, buyPrice } = generatePrices();
      
      // Generate random person details for this card (same details for both rent and buy)
      const personDetails = generateRandomPersonDetails();

      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <img src="${coverUrl}" alt="Book cover">
        <h3>${title}</h3>
        <p><strong>${author}</strong></p>
        <p>${description}</p>
        <div class="btn-group">
          <button class="rent" data-rent-price="${rentPrice}">Rent ₹${rentPrice}</button>
          <button class="buy" data-buy-price="${buyPrice}">Buy ₹${buyPrice}</button>
        </div>
      `;
      
      // Store person details in the card element
      card.dataset.personName = personDetails.name;
      card.dataset.personMobile = personDetails.mobile;
      card.dataset.personAddress = personDetails.address;
      card.dataset.personPincode = personDetails.pincode;
      
      // Add click handlers to buttons
      const rentBtn = card.querySelector(".rent");
      const buyBtn = card.querySelector(".buy");
      
      rentBtn.addEventListener("click", () => {
        const details = {
          name: card.dataset.personName,
          mobile: card.dataset.personMobile,
          address: card.dataset.personAddress,
          pincode: card.dataset.personPincode
        };
        showPersonDetailsModal(details, "Rent", rentPrice);
      });
      
      buyBtn.addEventListener("click", () => {
        const details = {
          name: card.dataset.personName,
          mobile: card.dataset.personMobile,
          address: card.dataset.personAddress,
          pincode: card.dataset.personPincode
        };
        showPersonDetailsModal(details, "Buy", buyPrice);
      });
      
      resultsDiv.appendChild(card);
    }
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error fetching data. Please try again.</p>";
    console.error(error);
  }
});