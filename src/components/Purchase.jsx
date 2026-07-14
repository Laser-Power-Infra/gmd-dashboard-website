import React, { useState, useEffect } from 'react';
import './Purchase.css';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Purchase = () => {
  const [masterItems, setMasterItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [displayCount, setDisplayCount] = useState(12);
  
  const [cartItems, setCartItems] = useState([]);

  // Fetch the extracted items on mount
  useEffect(() => {
    fetch('/purchaseItems.json')
      .then(res => res.json())
      .then(data => setMasterItems(data))
      .catch(err => console.error("Error loading master items:", err));
  }, []);

  // Helper to extract base category name (words before any number)
  const extractCategoryName = (name) => {
    if (!name) return null;
    const parts = name.split(' ');
    let cat = [];
    for (let p of parts) {
      if (/\d/.test(p)) break;
      cat.push(p);
    }
    let result = cat.join(' ').trim();
    return result ? result : name.split(' ').slice(0, 2).join(' ');
  };

  // Derive unique categories from item names
  const uniqueCategories = Array.from(
    new Set(
      masterItems
        .map(item => extractCategoryName(item.itemName))
        .filter(cat => cat && cat.trim() !== '')
    )
  ).sort();

  // Derive sub-categories based on selected category or hovered category
  const getSubCategoriesFor = (cat) => {
    return Array.from(
      new Set(
        masterItems
          .filter(item => extractCategoryName(item.itemName) === cat)
          .map(item => item.itemName)
          .filter(Boolean)
      )
    ).sort();
  };

  // Helper to get image based on item name keywords
  const getItemImage = (itemName) => {
    if (!itemName) return '/uploads/valves.jpg'; // default fallback
    const name = itemName.toUpperCase();

    // Sluice Valves
    if (name.includes('SLUICE VALVE') || name.includes('GATE VALVE')) {
      if (name.includes('CLASS 150#')) return '/purchase img/Cast Steel Gate Valve (Class 150#).jpeg';
      if (name.includes('CLASS 300#')) return '/purchase img/Cast Steel Gate Valve (Class 300#).jpeg';
      if (name.includes('CLASS 800#')) return '/purchase img/Forged Steel Gate Valve (Class 800#).jpeg';
      if (name.includes('METAL TO METAL') && name.includes('NON-RISING')) return '/purchase img/Metal Seated Sluice Valve (non Rising).jpeg';
      if (name.includes('METAL TO METAL') && name.includes('RISING')) return '/purchase img/Metal Seated Sluice Valve (Rising Spindle).jpeg';
      if (name.includes('NON-RISING')) return '/purchase img/Sluice valve (non rising).jpeg';
      if (name.includes('RISING')) return '/purchase img/Sluice valve (Rising Spindle) resilent Seated.jpeg';
      return '/purchase img/Sluice Gate Valve.jpeg';
    }

    // Butterfly Valves
    if (name.includes('BUTTERFLY VALVE')) {
      if (name.includes('WAFER TYPE')) return '/purchase img/Wafer Type butterfly valve.jpeg';
      if (name.includes('LUG TYPE') && name.includes('METAL TO METAL')) return '/purchase img/Lug type (Metal to Metal ) butterfly valve.jpeg';
      if (name.includes('LUG TYPE')) return '/purchase img/Lug type (Metal to Rubber) butterfly valve.jpeg';
      if (name.includes('FLANGE TYPE') && name.includes('METAL')) return '/purchase img/Double Flange Metal Seated Butterfly Valve.jpeg';
      if (name.includes('FLANGE TYPE')) return '/purchase img/Double Flange Resilent Seated Butterfly Valve.jpeg';
      return '/purchase img/Double Flange Resilent Seated Butterfly Valve.jpeg';
    }

    // Ball Valves
    if (name.includes('BALL VALVE')) {
      if (name.includes('2-PIECE')) return '/purchase img/2 piece ball valve.jpeg';
      if (name.includes('3-PIECE')) return '/purchase img/3 piece ball valve.jpeg';
      if (name.includes('SCREWED')) return '/purchase img/screw ball valve.jpeg';
      return '/purchase img/3 piece ball valve.jpeg';
    }

    // Check Valves & DPCV
    if (name.includes('DPCV')) return '/purchase img/Dual Plate Check Valve (API594).jpeg';
    if (name.includes('CHECK VALVE')) return '/purchase img/Non return check valve (IS5312, Part-1.jpeg';

    // Diaphragm Valves
    if (name.includes('DIAPHRAGM')) return '/purchase img/Diaphragm Valve.jpeg';

    // Dismantling Joints
    if (name.includes('DISMANTLING')) return '/purchase img/Dismantling joint.jpeg';

    // Float Valves
    if (name.includes('FLOAT')) return '/purchase img/Float Valve.jpeg';

    // Globe Valves
    if (name.includes('GLOBE')) return '/purchase img/Globe Valve.jpeg';

    // Air Valves
    if (name.includes('AIR VALVE') || name.includes('KINETIC')) return '/purchase img/Kinetic Air Valve (DK type).jpeg';

    // Flanges
    if (name.includes('FLANGE') && !name.includes('BUTTERFLY')) return '/purchase img/MS companion flange.jpeg';

    // Pressure Relief Valves
    if (name.includes('RELIEF')) return '/purchase img/Pressure relief valve (Spring loaded).jpeg';

    // Knife Gate Valves
    if (name.includes('KNIFE GATE')) return '/purchase img/knife gate Valve.jpeg';

    // Needle Valves
    if (name.includes('NEEDLE')) return '/purchase img/needle valve.jpeg';

    // Pressure Reducing Valves (PRV)
    if (name.includes('REDUCING') || name.includes('PRV')) return '/purchase img/pressure reducing valve.jpeg';

    // Solenoid Valves
    if (name.includes('SOLENOID')) return '/purchase img/solenoid Valve.jpeg';

    // Fallback
    return '/uploads/valves.jpg';
  };

  // Handle Search Input & Filter
  const filteredItems = masterItems.filter(item => {
    // Search match
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      matchesSearch = (item.itemName && item.itemName.toLowerCase().includes(term)) ||
                      (item.itemCode && item.itemCode.toLowerCase().includes(term));
    }

    // Category match
    let matchesCategory = true;
    if (selectedCategory !== "All") {
      const itemCat = extractCategoryName(item.itemName);
      matchesCategory = itemCat === selectedCategory;
    }

    // Sub-Category match
    let matchesSubCategory = true;
    if (selectedSubCategory !== "All") {
      matchesSubCategory = item.itemName === selectedSubCategory;
    }

    return matchesSearch && matchesCategory && matchesSubCategory;
  });


const uniqueFilteredItems = filteredItems.filter(
  (item, index, self) =>
    index === self.findIndex((t) => t.itemCode === item.itemCode)
);

const displayedItems = uniqueFilteredItems.slice(0, displayCount);
const hasMore = displayCount < uniqueFilteredItems.length;
  




  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDisplayCount(12); // Reset count on new search
  };

  const handleAddItem = (masterItem) => {
    // Check if already added
    if (cartItems.some(i => i.itemCode === masterItem.itemCode)) {
      alert("This item is already in your purchase list!");
      return;
    }

    setCartItems([...cartItems, {
      ...masterItem,
      quantity: "1",
      remarks: "",
    }]);
    
    // Optional: scroll to cart or show toast
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };

  const handleCartChange = (index, field, value) => {
    const updatedItems = [...cartItems];
    updatedItems[index][field] = value;
    setCartItems(updatedItems);
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: "rzp_test_T3S8E6j1oqxv2J", // Test Key Placeholder
      amount: 500000, // ₹500
      currency: "INR",
      name: "GM Dalui & Sons",
      description: "Purchase Order Payment",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        console.log("Payment details:", response);
        console.log("Purchased Items:", cartItems);
        setCartItems([]); // Clear cart after successful payment
      },
      theme: {
        color: "#111827",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = () => {
    if (cartItems.length === 0) {
      alert("Please add at least one item to purchase.");
      return;
    }
    // Proceed to payment
    handlePayment();
  };

  return (
    <div className="purchase-page-wrapper">
      <div className="purchase-hero">
        <div className="container">
          <h1 className="purchase-hero-title">Purchase Request</h1>
          <p className="purchase-hero-subtitle">
            Browse our catalog or search for specific items to add to your purchase list.
          </p>
        </div>
      </div>

      <div className="container">
        
        {/* Search & Filter Section */}
        <div className="purchase-search-section">
          <div className="filter-controls-container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div className="search-box-container static-search" style={{ flex: 1, margin: 0 }}>
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                className="purchase-search-input"
                placeholder="Search by Item Code or Description (e.g. SLUICE VALVE 40MM)"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => handleSearchChange({target: {value: ''}})}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="category-filter-container custom-dropdown-container">
              {/* Invisible Backdrop for closing on outside click */}
              {isDropdownOpen && (
                <div 
                  className="dropdown-backdrop"
                  style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}
                  onClick={() => { setIsDropdownOpen(false); setHoveredCategory(null); }}
                />
              )}

              <button 
                className="custom-dropdown-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ position: 'relative', zIndex: 1000 }}
              >
                {selectedSubCategory !== "All" 
                  ? selectedSubCategory 
                  : (selectedCategory !== "All" ? selectedCategory : "All Item Types")}
                <i className="fas fa-chevron-down"></i>
              </button>

              {isDropdownOpen && (
                <div 
                  className="custom-dropdown-panel" 
                  style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, zIndex: 1000, marginTop: '5px' }}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  
                  {/* Main Menu */}
                  <ul className="custom-dropdown-menu" style={{ position: 'relative', top: 0, left: 0, marginTop: 0, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <li 
                      className="custom-dropdown-item" 
                      onClick={() => { 
                        setSelectedCategory("All"); 
                        setSelectedSubCategory("All"); 
                        setIsDropdownOpen(false); 
                        setDisplayCount(12);
                      }}
                      onMouseEnter={() => setHoveredCategory(null)}
                    >
                      All Item Types
                    </li>
                    {uniqueCategories.map(cat => (
                      <li 
                        key={cat} 
                        className={`custom-dropdown-item has-submenu ${hoveredCategory === cat ? 'active-hover' : ''}`}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(cat);
                          setSelectedSubCategory("All");
                          setIsDropdownOpen(false);
                          setDisplayCount(12);
                        }}
                      >
                        <span>{cat}</span>
                        <i className="fas fa-chevron-right"></i>
                      </li>
                    ))}
                  </ul>

                  {/* Submenu renders next to main menu when hovering */}
                  {hoveredCategory && (
                    <ul 
                      className="custom-submenu" 
                      style={{ 
                        position: 'relative', 
                        top: 0, 
                        left: 0, 
                        marginLeft: '10px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        borderLeft: '2px solid #0b1c47'
                      }}
                    >
                      <li 
                        className="custom-submenu-item"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedCategory(hoveredCategory); 
                          setSelectedSubCategory("All"); 
                          setIsDropdownOpen(false); 
                          setDisplayCount(12);
                        }}
                      >
                        <strong>All {hoveredCategory}s</strong>
                      </li>
                      {getSubCategoriesFor(hoveredCategory).map(subCat => (
                        <li 
                          key={subCat}
                          className="custom-submenu-item"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedCategory(hoveredCategory); 
                            setSelectedSubCategory(subCat); 
                            setIsDropdownOpen(false); 
                            setDisplayCount(12);
                          }}
                        >
                          {subCat}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="catalog-section">
          <h2 className="section-heading">Available Items</h2>
          <div className="purchase-grid">
            {displayedItems.map((item, index) => (
              <div key={item.itemCode} className="purchase-card catalog-card">
                <div className="purchase-card-header">
                  <div>
                    <h2 className="item-code">
                      {extractCategoryName(item.itemName) || item.itemCode}
                    </h2>
                    <span className="item-cat-badge">FINISHED / COMPLETE VALVE</span>
                  </div>
                </div>

                {/* Add Product Image */}
                <div className="item-image-box" style={{ width: '100%', height: '200px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderBottom: '1px solid #eee' }}>
                  <img src={getItemImage(item.itemName)} alt={item.itemName} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div className="item-desc-box">
                  <p className="desc-text">{item.itemName}</p>
                </div>

                <div className="catalog-action">
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => handleAddItem(item)}
                  >
                    <i className="fas fa-plus"></i> Add to List
                  </button>
                </div>
              </div>
            ))}
          </div>

          {uniqueFilteredItems.length === 0 && (
            <div className="empty-catalog-message">
              <p>No items found matching "{searchTerm}"</p>
            </div>
          )}

          {hasMore && (
            <div className="load-more-container">
              <button className="btn-load-more" onClick={handleLoadMore}>
                View More
              </button>
            </div>
          )}
        </div>

        <hr className="section-divider" />

        {/* Selected Items (Cart) Grid */}
        <div className="cart-section" id="cart">
          <h2 className="section-heading">Your Purchase List ({cartItems.length})</h2>
          
          {cartItems.length > 0 ? (
            <div className="purchase-grid">
              {cartItems.map((item, index) => (
                <div key={`cart-${item.itemCode}`} className="purchase-card cart-card">
                  <div className="purchase-card-header">
                    <div>
                      <h2 className="item-code">
                        {extractCategoryName(item.itemName) || item.itemCode}
                      </h2>
                      <span className="item-cat-badge">FINISHED / COMPLETE VALVE</span>
                    </div>
                    <button className="remove-item-btn" onClick={() => handleRemoveItem(index)} title="Remove Item">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>

                  {/* Add Product Image */}
                  <div className="item-image-box" style={{ width: '100%', height: '150px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderBottom: '1px solid #eee', marginTop: '10px' }}>
                    <img src={getItemImage(item.itemName)} alt={item.itemName} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>

                  <div className="item-desc-box">
                    <span className="desc-label">Item Description</span>
                    <p className="desc-text">{item.itemName}</p>
                  </div>

                  <div className="purchase-form-group">
                    <input
                      type="number"
                      placeholder="Enter Quantity"
                      value={item.quantity}
                      onChange={(e) => handleCartChange(index, "quantity", e.target.value)}
                      className="purchase-input"
                      min="1"
                    />
                    <textarea
                      placeholder="Remarks (Optional)"
                      value={item.remarks}
                      onChange={(e) => handleCartChange(index, "remarks", e.target.value)}
                      className="purchase-textarea"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-cart-message">
              <i className="fas fa-box-open"></i>
              <p>Your purchase list is empty. Add items from the catalog above.</p>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="purchase-action-container">
              <button onClick={handleSubmit} className="btn-primary purchase-submit-btn">
                Submit Request & Pay <i className="fas fa-credit-card"></i>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Purchase;
