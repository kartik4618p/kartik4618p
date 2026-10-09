// Generate random address and pincode (name and mobile come from MySQL)
function generateAddressAndPincode() {
    const streets = ["MG Road", "Park Street", "Main Street", "Gandhi Nagar", "Nehru Colony", "Indira Nagar", "Rajiv Nagar", "Vijay Nagar", "Shanti Nagar", "Prem Nagar"];
    const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
    const streetNumber = Math.floor(Math.random() * 999) + 1;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const address = `${streetNumber}, ${street}, ${city}`;
    const pincode = Math.floor(Math.random() * 900000) + 100000;
    return { address, pincode };
}

function showPersonDetailsModal(personDetails, action, price) {
    const existingModal = document.getElementById("personDetailsModal");
    if (existingModal) existingModal.remove();
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
        </div>`;
    document.body.appendChild(modal);
    modal.querySelector(".person-modal-close").addEventListener("click", () => modal.remove());
    modal.querySelector(".close-modal-btn").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
}

async function loadUploadedBooks() {
    const response = await fetch("/api/uploaded_books");
    const books = await response.json();
    const grid = document.getElementById("uploadedGrid");
    grid.innerHTML = "";
    books.forEach(b => {
        const { address, pincode } = generateAddressAndPincode();
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <img src="/static/uploads/${b.image}" alt="${b.bookname}">
            <h3>${b.bookname}</h3>
            <p><strong>${b.author}</strong></p>
            <p>${b.description}</p>
            <div class="btn-group">
                <button class="rent" data-rent-price="${b.rentprice}">Rent ₹${b.rentprice}</button>
                <button class="buy" data-buy-price="${b.buyprice}">Buy ₹${b.buyprice}</button>
            </div>`;
        card.dataset.personName = b.name;
        card.dataset.personMobile = b.mobile;
        card.dataset.personAddress = address;
        card.dataset.personPincode = pincode;
        const rentBtn = card.querySelector(".rent");
        const buyBtn = card.querySelector(".buy");
        rentBtn.addEventListener("click", () => {
            const details = {
                name: card.dataset.personName,
                mobile: card.dataset.personMobile,
                address: card.dataset.personAddress,
                pincode: card.dataset.personPincode
            };
            showPersonDetailsModal(details, "Rent", b.rentprice);
        });
        buyBtn.addEventListener("click", () => {
            const details = {
                name: card.dataset.personName,
                mobile: card.dataset.personMobile,
                address: card.dataset.personAddress,
                pincode: card.dataset.personPincode
            };
            showPersonDetailsModal(details, "Buy", b.buyprice);
        });
        grid.appendChild(card);
    });
}
loadUploadedBooks();
