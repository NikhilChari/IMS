import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:8000';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: 0, price: 0.0, supplier_id: 1 });
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(`${API_BASE}/items/`);
    setItems(response.data);
  };

  const addItem = async () => {
    await axios.post(`${API_BASE}/items/`, newItem);
    fetchItems();
    setNewItem({ name: '', category: '', quantity: 0, price: 0.0, supplier_id: 1 });
  };

  const updateItem = async (id) => {
    await axios.put(`${API_BASE}/items/${id}`, editingItem);
    fetchItems();
    setEditingItem(null);
  };

  const deleteItem = async (id) => {
    await axios.delete(`${API_BASE}/items/${id}`);
    fetchItems();
  };

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="App">
      <h1>Grocery Inventory Management</h1>
      <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <h2>Add New Item</h2>
      <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
      <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
      <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} />
      <input type="number" step="0.01" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} />
      <button onClick={addItem}>Add Item</button>
      <h2>Inventory</h2>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            {editingItem && editingItem.id === item.id ? (
              <div>
                <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                <input type="text" value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} />
                <input type="number" value={editingItem.quantity} onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })} />
                <input type="number" step="0.01" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })} />
                <button onClick={() => updateItem(item.id)}>Save</button>
                <button onClick={() => setEditingItem(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {item.name} - {item.category} - Qty: {item.quantity} - Price: ${item.price} - Supplier: {item.supplier.name}
                <button onClick={() => setEditingItem(item)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;