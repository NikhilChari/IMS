// Sample inventory data (in a real app, this would come from a database)
let inventory = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        quantity: 15,
        price: 99.99,
        image: "http://static.photos/technology/200x200/1"
    },
    {
        id: 2,
        name: "Organic Cotton T-Shirt",
        category: "Clothing",
        quantity: 42,
        price: 24.95,
        image: "http://static.photos/black/200x200/2"
    },
    {
        id: 3,
        name: "Ergonomic Office Chair",
        category: "Furniture",
        quantity: 8,
        price: 249.99,
        image: "http://static.photos/office/200x200/3"
    },
    // Added a sample Food item with expiry
    {
        id: 4,
        name: "Organic Apples",
        category: "Food",
        quantity: 50,
        price: 2.99,
        image: "http://static.photos/food/200x200/4",
        expiry: "2024-12-31"
    }
];

// DOM elements
const inventoryTable = document.getElementById('inventoryTable');
const addItemBtn = document.getElementById('addItemBtn');
const itemModal = document.getElementById('itemModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const itemForm = document.getElementById('itemForm');
const itemImage = document.getElementById('itemImage');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const sortCategory = document.getElementById('sortCategory');
const itemCategory = document.getElementById('itemCategory');
const expiryDateField = document.getElementById('expiryDateField');

// Current item being edited
let currentItemId = null;

// Initialize the app
function init() {
    renderInventory();
    setupEventListeners();
}

// Render inventory table
function renderInventory(filteredInventory = inventory) {
    inventoryTable.innerHTML = '';
    
    filteredInventory.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'table-row-hover';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${item.image}" alt="${item.name}" class="h-10 w-10 rounded-full object-cover">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${item.price.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.category === 'Food' ? (item.expiry || 'N/A') : 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-primary hover:text-primary-600 mr-3 edit-btn" data-id="${item.id}">
                    <i data-feather="edit"></i>
                </button>
                <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${item.id}">
                    <i data-feather="trash-2"></i>
                </button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
    
    feather.replace();
}

// Setup event listeners
function setupEventListeners() {
    // Add item button
    addItemBtn.addEventListener('click', () => {
        currentItemId = null;
        document.getElementById('modalTitle').textContent = 'Add New Item';
        itemForm.reset();
        imagePreview.classList.add('hidden');
        toggleExpiryField(); // Ensure expiry field is hidden initially
        itemModal.classList.remove('hidden');
    });
    
    // Close modal buttons
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Image preview
    itemImage.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                imagePreview.classList.remove('hidden');
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Form submission
    itemForm.addEventListener('submit', handleFormSubmit);
    
    // Event delegation for edit and delete buttons
    inventoryTable.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const itemId = parseInt(e.target.closest('.edit-btn').getAttribute('data-id'));
            editItem(itemId);
        } else if (e.target.closest('.delete-btn')) {
            const itemId = parseInt(e.target.closest('.delete-btn').getAttribute('data-id'));
            deleteItem(itemId);
        }
    });

    // Sort by category
    sortCategory.addEventListener('change', () => {
        const selectedCategory = sortCategory.value;
        let filteredItems = inventory;
        if (selectedCategory) {
            filteredItems = inventory.filter(item => item.category === selectedCategory);
        }
        renderInventory(filteredItems);
    });

    // Toggle expiry date field based on category
    itemCategory.addEventListener('change', toggleExpiryField);
}

// Toggle expiry date field
function toggleExpiryField() {
    if (itemCategory.value === 'Food') {
        expiryDateField.classList.remove('hidden');
    } else {
        expiryDateField.classList.add('hidden');
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const itemData = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        quantity: parseInt(document.getElementById('itemQuantity').value),
        price: parseFloat(document.getElementById('itemPrice').value),
        image: previewImage.src || "http://static.photos/minimal/200x200/" + Math.floor(Math.random() * 100)
    };

    // Add expiry if category is Food
    if (itemData.category === 'Food') {
        itemData.expiry = document.getElementById('itemExpiry').value;
    }
    
    if (currentItemId) {
        // Update existing item
        const index = inventory.findIndex(item => item.id === currentItemId);
        inventory[index] = { ...inventory[index], ...itemData };
    } else {
        // Add new item
        const newId = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;
        inventory.push({ id: newId, ...itemData });
    }
    
    renderInventory();
    closeModal();
}

// Edit item
function editItem(id) {
    const item = inventory.find(item => item.id === id);
    if (!item) return;
    
    currentItemId = id;
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemPrice').value = item.price;
    
    if (item.category === 'Food') {
        document.getElementById('itemExpiry').value = item.expiry || '';
    }
    
    if (item.image) {
        previewImage.src = item.image;
        imagePreview.classList.remove('hidden');
    } else {
        imagePreview.classList.add('hidden');
    }
    
    toggleExpiryField(); // Show/hide expiry based on category
    itemModal.classList.remove('hidden');
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        renderInventory();
    }
}

// Close modal
function closeModal() {
    itemModal.classList.add('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
