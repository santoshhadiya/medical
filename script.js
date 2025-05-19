import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3X71Knb155dt0da8kGxXX79MLr0pGIYo",
  authDomain: "medical-app-32f35.firebaseapp.com",
  projectId: "medical-app-32f35",
  storageBucket: "medical-app-32f35.appspot.com",
  messagingSenderId: "391441233756",
  appId: "1:391441233756:web:b2f42aedb734991fa33399",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const medicinesRef = ref(db, "medicines");

const addMedicineBtn = document.getElementById("addMedicineBtn");
const medicineForm = document.getElementById("medicineForm");
const medicineFormElement = document.getElementById("medicineFormElement");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const medicinesTableBody = document.getElementById("medicinesTableBody");

const formFields = {
  name: document.getElementById("medicineName"),
  brand: document.getElementById("medicineBrand"),
  generic: document.getElementById("medicineGeneric"),
  type: document.getElementById("medicineType"),
  dosage: document.getElementById("medicineDosage"),
  price: document.getElementById("medicinePrice"),
  stock: document.getElementById("medicineStock"),
  description: document.getElementById("medicineDescription"),
  sideEffects: document.getElementById("medicineSideEffects"),
  image: document.getElementById("medicineImage"),
};

let currentMedicineId = null;

function toggleForm(show = true, isEdit = false, medicine = null) {
  if (show) {
    medicineForm.classList.remove("hidden");
    if (isEdit && medicine) {
      currentMedicineId = medicine.id;
      for (const [field, element] of Object.entries(formFields)) {
        element.value = medicine[field] || "";
      }
      medicineForm.querySelector("h2").textContent = "Edit Medicine";
    } else {
      currentMedicineId = null;
      medicineFormElement.reset();
      medicineForm.querySelector("h2").textContent = "Add Medicine";
    }
  } else {
    medicineForm.classList.add("hidden");
    currentMedicineId = null;
  }
}
function saveMedicine(e) {
  e.preventDefault();
  const medicineData = {
    name: formFields.name.value,
    brand: formFields.brand.value,
    generic: formFields.generic.value,
    type: formFields.type.value,
    dosage: formFields.dosage.value,
    price: parseFloat(formFields.price.value),
    stock: parseInt(formFields.stock.value),
    description: formFields.description.value,
    sideEffects: formFields.sideEffects.value,
    image: formFields.image.value,
    createdAt: new Date().toISOString(),
  };

  if (currentMedicineId) {
    update(ref(db, `medicines/${currentMedicineId}`), medicineData)
      .then(() => {
        alert("Medicine updated successfully!");
        toggleForm(false);
      })
      .catch((error) => {
        console.error("Error updating:", error);
        alert("Error updating medicine.");
      });
  } else {
    push(medicinesRef, medicineData)
      .then(() => {
        alert("Medicine added successfully!");
        toggleForm(false);
      })
      .catch((error) => {
        console.error("Error adding:", error);
        alert("Error adding medicine.");
      });
  }
}

function deleteMedicine(medicineId) {
  if (confirm("Are you sure to delete this medicine?")) {
    remove(ref(db, `medicines/${medicineId}`))
      .then(() => alert("Medicine deleted successfully!"))
      .catch((error) => {
        console.error("Error deleting:", error);
        alert("Error deleting medicine.");
      });
  }
}

function renderMedicinesTable(medicines) {
  const medicinesTableBody = document.getElementById("medicinesTableBody");
  medicinesTableBody.innerHTML = "";

  if (medicines.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="9" class="px-6 py-4 text-center text-gray-500">No medicines found.</td>`;
    medicinesTableBody.appendChild(row);
    return;
  }

  medicines.forEach((medicine,i) => {
   const row = document.createElement("tr");
row.className = "group transition-all duration-200 hover:bg-gray-50/80 w-full";

row.innerHTML = `
<!-- Mobile-optimized card (primary view) -->
<td class="p-4 w-full sm:hidden">
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-gray-200">
    <!-- Image and top info row -->
    <div class="flex p-4 pb-2 gap-4 items-start">
      <!-- Dynamic image container -->
      
      <div class="relative flex-shrink-0">
        <img src="${medicine.image || 'https://via.placeholder.com/80'}" alt="${medicine.name}"
          class="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-inner">
        <!-- Stock indicator badge -->
        <div class="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full border-2 border-white bg-green-100 text-green-800 text-xs font-bold shadow-sm">
          ${medicine.stock} 
        </div>
      </div>

      <!-- Text content -->
      <div class="flex-1 min-w-0 space-y-1">
        <div class="justify-between items-start gap-2">
          <p class="text-lg font-bold text-gray-900  pr-2 w-[250px] break-words">
            ${medicine.name}
          </p>
          <span class="text-lg font-extrabold text-green-600 whitespace-nowrap">
              ₹${medicine.price.toFixed(2)} 
              
              
          </span>
        </div>
        
        <p class="text-sm font-medium text-gray-500 truncate">
          ${medicine.brand}
        </p>
        
        <!-- Rating/status chips -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ${medicine.type}
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            ${medicine.dosage}
          </span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-100 mx-4"></div>

    <!-- Action buttons -->
    <div class="p-3 flex gap-3 w-[100px] ml-[250px]">
      <button class="edit-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all"
        data-id="${medicine.id}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
       
      </button>
      <button class="delete-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border  rounded-lg  font-medium text-sm hover:bg-red-50  transition-all"
        data-id="${medicine.id}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        
      </button>
    </div>
  </div>
</td>




  <!-- Desktop cells (hidden on mobile) -->
   <td class="w-full">
  <div class="flex items-center w-full">

    <!-- Image + Name -->
    <div class="hidden sm:flex items-center  border-r-[1px] px-6 py-4 w-[250px]">
      <h6 class="p-2 border border-gray-200 rounded-lg m-2">${i+1}</h6>
      <img src="${medicine.image || "https://via.placeholder.com/50"}" alt="${
      medicine.name
    }"
        class="w-10 h-10 rounded-md object-cover border border-gray-300 mr-3">
      <span class="text-sm font-medium text-gray-900">${medicine.name}</span>
    </div>

    <!-- Brand -->
    <div class="hidden sm:flex items-center px-4 py-4 w-[150px]">
      <span class="text-sm text-gray-500 font-medium">${medicine.brand}</span>
    </div>

    <!-- Generic -->
    <div class="hidden lg:flex items-center px-4 py-4 w-[150px]">
      <span class="text-sm text-gray-500">${medicine.generic}</span>
    </div>

    <!-- Type -->
    <div class="hidden md:flex items-center px-4 py-4 w-[120px]">
      <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        ${medicine.type}
      </span>
    </div>

    <!-- Dosage -->
    <div class="hidden md:flex items-center px-4 py-4 w-[120px]">
      <span class="text-sm text-gray-500">${medicine.dosage}</span>
    </div>

    <!-- Price -->
    <div class="hidden sm:flex items-center justify-end px-4 py-4 w-[120px]">
      <span class="text-sm font-bold text-green-600">₹${medicine.price.toFixed(
        2
      )}</span>
    </div>

    
    <!-- Actions -->
    <div class="hidden sm:flex items-center justify-end px-4 py-4 w-[180px] space-x-2">
      <button
        class="edit-btn text-blue-600 hover:text-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
        data-id="${medicine.id}">
        Edit
      </button>
      <button
        class="delete-btn text-red-600 hover:text-red-900 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
        data-id="${medicine.id}">
        Delete
      </button>
    </div>

  </div>
</td>

  
  
  
  
`; // Row click (except buttons)
    row.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        showMedicineDetails(medicine);
      }
    });

    medicinesTableBody.appendChild(row);
  });

  // Event Listeners for Edit & Delete
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const medicineId = e.target.dataset.id;
      const medicine = medicines.find((m) => m.id === medicineId);
      if (medicine) toggleForm(true, true, medicine);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const medicineId = e.target.dataset.id;
      deleteMedicine(medicineId);
    });
  });
}

function searchMedicines(medicines, searchTerm) {
  if (!searchTerm) return medicines;
  searchTerm = searchTerm.toLowerCase();
  return medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm) ||
      med.brand.toLowerCase().includes(searchTerm) ||
      med.generic.toLowerCase().includes(searchTerm)
  );
}

function loadMedicines() {
  onValue(medicinesRef, (snapshot) => {
    const data = snapshot.val();
    const medicines = data
      ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
      : [];
    const searchTerm = searchInput.value.trim();
    const filteredMedicines = searchMedicines(medicines, searchTerm);
    renderMedicinesTable(filteredMedicines);
  });
}

function showMedicineDetails(medicine) {
  document.getElementById("detailName").textContent = medicine.name;
  document.getElementById(
    "detailBrand"
  ).textContent = `Brand: ${medicine.brand}`;
  document.getElementById(
    "detailGeneric"
  ).textContent = `Generic: ${medicine.generic}`;
  document.getElementById("detailType").textContent = medicine.type;
  document.getElementById("detailDosage").textContent = medicine.dosage;
  document.getElementById("detailPrice").textContent =
    medicine.price.toFixed(2);
  document.getElementById("detailStock").textContent = medicine.stock;
  document.getElementById("detailDescription").textContent =
    medicine.description || "No description available";
  document.getElementById("detailSideEffects").textContent =
    medicine.sideEffects || "No side effects listed";
  document.getElementById("detailImage").src =
    medicine.image || "https://via.placeholder.com/150";
  document.getElementById("medicineDetailBox").classList.remove("hidden");
}

document.getElementById("closeDetailBox").addEventListener("click", () => {
  document.getElementById("medicineDetailBox").classList.add("hidden");
});

document.getElementById("closeDetailBox_2").addEventListener("click", () => {
  document.getElementById("medicineDetailBox").classList.add("hidden");
});

// Event listeners
addMedicineBtn.addEventListener("click", () => toggleForm(true));
cancelFormBtn.addEventListener("click", () => toggleForm(false));
medicineFormElement.addEventListener("submit", saveMedicine);
searchButton.addEventListener("click", loadMedicines);
searchInput.addEventListener("input", loadMedicines);

// Initial load
loadMedicines();
