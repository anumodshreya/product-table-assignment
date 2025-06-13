import React, { useEffect, useState } from 'react';
import "../App.css";

import {getAllProducts, updateProductTitle, deleteProduct, updateProductMOQ } from '../api/productService';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [filters, setFilters] = useState({ brand: '', category: '', price: '', rating: '' });
  const [editingMOQId, setEditingMOQId] = useState(null);
  const [editedMOQ, setEditedMOQ] = useState('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [isSavingMOQ, setIsSavingMOQ] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [visibleColumns, setVisibleColumns] = useState({
    image: true,
    title: true,
    brand: true,
    category: true,
    price: true,
    rating: true,
    returnPolicy: true,
    moq: true,
    actions: true,
  });

  useEffect(() => { setError(null); setLoading(true); getAllProducts().then((data) => {setProducts(data);setLoading(false);})
        .catch((err) => { console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.'); 
        setLoading(false); });
  }, []);
//edit title
  const handleTitleClick = (id, currentTitle) => {setEditingId(id); setEditedTitle(currentTitle);};
  const handleTitleChange = (e) => setEditedTitle(e.target.value);
  const handleTitleBlur = (id) => 
    {if (editedTitle.trim() === '') {console.log('Title cannot be empty.');
      return;
     }
     setIsSavingTitle(true);
     updateProductTitle(id, editedTitle).then((updatedProducts) => {setProducts(updatedProducts);setIsSavingTitle(false);setEditingId(null);
     }).catch(err => {console.error("Error updating title:", err); setIsSavingTitle(false); setEditingId(null);});
    };

  const cancelTitleEdit = (originalTitle) => {setEditedTitle(originalTitle);setEditingId(null);};
  const handleMOQClick = (id, currentMOQ) => { setEditingMOQId(id);setEditedMOQ(currentMOQ?.toString() || '');};
  const handleMOQChange = (e) => setEditedMOQ(e.target.value);

  const handleMOQBlur = (id) => 
    { const moqNum = Number(editedMOQ);
      if (!editedMOQ.trim() || isNaN(moqNum) || moqNum <= 0 || !Number.isInteger(moqNum)) 
     {
      console.log('MOQ must be a positive whole number.');
      return;
     }

     setIsSavingMOQ(true);
     updateProductMOQ(id, moqNum).then((updatedProducts) => {setProducts(updatedProducts);setIsSavingMOQ(false);setEditingMOQId(null);})
     .catch(err => {
     console.error("Error updating MOQ:", err);setIsSavingMOQ(false);setEditingMOQId(null);});
    };

  const cancelMOQEdit = (originalMOQ) => { setEditedMOQ(originalMOQ?.toString() || '');setEditingMOQId(null);};

  const handleDelete = (id) =>
    {
    deleteProduct(id).then((updatedProducts) => {setProducts(updatedProducts);}).catch(err => {
      console.error("Error deleting product:", err);});
 };

  const getFilteredProducts = () => {
    return products
      .filter((prod) =>
          (prod.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||(prod.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
      .filter((prod) =>
          (filters.brand === '' || prod.brand === filters.brand) &&
          (filters.category === '' || prod.category === filters.category) &&
          (filters.price === '' || prod.price.toString() === filters.price) &&
          (filters.rating === '' || prod.rating.toString() === filters.rating)
      );
  };

  const sortedProducts = () => { const sorted = [...getFilteredProducts()];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key] ?? 0;
        let bVal = b[sortConfig.key] ?? 0;
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  };

  const toggleSort = (key) => {setSortConfig((prev) => ({key,direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',}));};
  const handleResetFilters = () => {setSearchQuery('');setFilters({ brand: '', category: '', price: '', rating: '' });setCurrentPage(1);};
  const allSorted = sortedProducts();
  const totalPages = Math.ceil(allSorted.length / productsPerPage);
  const paginatedProducts = allSorted.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const allBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const allCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const allPrices = [...new Set(products.map((p) => p.price.toString()))];
  const allRatings = [...new Set(products.map((p) => p.rating.toString()))];

  const getDynamicFilterOptions = (key) => {
    const tempFiltered = products.filter(
      (prod) =>
        (searchQuery === '' || (prod.title?.toLowerCase().includes(searchQuery.toLowerCase()) || prod.brand?.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (filters.brand === '' || prod.brand === filters.brand) &&
        (filters.category === '' || prod.category === filters.category) &&
        (filters.price === '' || prod.price.toString() === filters.price) &&
        (filters.rating === '' || prod.rating.toString() === filters.rating)
    );
  let actualFilteredOptions = tempFiltered;
    if (key === 'brand') actualFilteredOptions = products.filter(p => (searchQuery === '' || (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))) && (filters.category === '' || p.category === filters.category) && (filters.price === '' || p.price.toString() === filters.price) && (filters.rating === '' || p.rating.toString() === filters.rating));
    if (key === 'category') actualFilteredOptions = products.filter(p => (searchQuery === '' || (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))) && (filters.brand === '' || p.brand === filters.brand) && (filters.price === '' || p.price.toString() === filters.price) && (filters.rating === '' || p.rating.toString() === filters.rating));
    if (key === 'price') actualFilteredOptions = products.filter(p => (searchQuery === '' || (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))) && (filters.brand === '' || p.brand === filters.brand) && (filters.category === '' || p.category === filters.category) && (filters.rating === '' || p.rating.toString() === filters.rating));
    if (key === 'rating') actualFilteredOptions = products.filter(p => (searchQuery === '' || (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))) && (filters.brand === '' || p.brand === filters.brand) && (filters.category === '' || p.category === filters.category) && (filters.price === '' || p.price.toString() === filters.price));
    return [...new Set(actualFilteredOptions.map(p => p[key]?.toString()).filter(Boolean))].sort(); };
    if (loading) return <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '2rem', color: '#374151', background: '#f4f7f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading products...</p>;
    if (error) return <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '2rem', color: '#ef4444', background: '#f4f7f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error: {error}</p>;
  const toggleColumn = (col) => {setVisibleColumns((prev) => ({...prev, [col]: !prev[col],}));}

    return (
    <div style={{maxWidth: '1280px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f4f7f6', fontFamily: 'Inter, sans-serif'}}>
    <div style={{width: '100%',display: 'flex', justifyContent: 'center', marginBottom: '1rem',marginTop: '1rem'}}>
     <input type="text"
      placeholder="Search by title or brand..." 
      value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value);setCurrentPage(1);}}
      style={{
              padding: '0.75rem 1rem', width: '80%', maxWidth: '600px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', outline: 'none', transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out', 
            }}
          onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }} 
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)'; }} 
     />
    </div>
    <div style={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem', 
        marginBottom: '2rem', 
        backgroundColor: '#ffffff', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
      }}>
     <select
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })} value={filters.brand}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            minWidth: '150px' 
          }}
          onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)'; }}
        >
        <option value="">All Brands</option>
        {getDynamicFilterOptions('brand').map((brand, i) => ( <option key={i} value={brand}>{brand}</option>))}
     </select>

     <select
          onChange={(e) => setFilters({ ...filters, category: e.target.value })} value={filters.category}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            minWidth: '150px'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)'; }}
        >
          <option value="">All Categories</option>
          {getDynamicFilterOptions('category').map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
     </select>

     <select onChange={(e) => setFilters({ ...filters, price: e.target.value })} value={filters.price}
            style={{
             padding: '0.75rem 1rem',
             border: '1px solid #d1d5db',
             borderRadius: '8px',
             boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
             outline: 'none',
             transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
             minWidth: '150px'
             }}
          onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)'; }}>
          <option value="">All Prices</option>
          {getDynamicFilterOptions('price').map((price, i) => (<option key={i} value={price}>${price}</option>))}
     </select>

     <select onChange={(e) => setFilters({ ...filters, rating: e.target.value })} value={filters.rating}
            style={{
             padding: '0.75rem 1rem',
             border: '1px solid #d1d5db',
             borderRadius: '8px',
             boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
             outline: 'none',
             transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
             minWidth: '150px'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)'; }}>
          <option value="">All Ratings</option>
          {getDynamicFilterOptions('rating').map((r, i) => (<option key={i} value={r}>{r}</option>))}
     </select>
 <button onClick={handleResetFilters}
         style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            transition: 'background-color 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}>
          Reset Filters
 </button>
      </div>

      <div style={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem', 
        marginBottom: '2rem', 
      }}>
        {Object.keys(visibleColumns).map((col) => (
          <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#4b5563', fontWeight: '500' }}>
           <input
              type="checkbox"
              checked={visibleColumns[col]}
              onChange={() => toggleColumn(col)}
              style={{ accentColor: '#4f46e5', width: '1.1rem', height: '1.1rem', borderRadius: '4px' }} // Styled checkbox
           />
           {col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          </label>
        ))}
      </div>
      <div style={{
        width: '100%',
        overflowX: 'auto',
        marginBottom: '2rem',
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', 
      }}>
        <table style={{width: '100%',borderCollapse: 'collapse',}}>
          <thead>
            <tr>
              {visibleColumns.image && <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderTopLeftRadius: '12px' }}>Image</th>}
              {visibleColumns.title && <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>}
              {visibleColumns.brand && <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand</th>}
              {visibleColumns.category && <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>}
              {visibleColumns.price && (
                <th onClick={() => toggleSort('price')} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                  Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '⬆️' : '⬇️') : ''}
                </th>
              )}
              {visibleColumns.rating && (
                <th onClick={() => toggleSort('rating')} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                  Rating {sortConfig.key === 'rating' ? (sortConfig.direction === 'asc' ? '⬆️' : '⬇️') : ''}
                </th>
              )}
              {visibleColumns.returnPolicy && <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Return Policy</th>}
              {visibleColumns.moq && (
                <th onClick={() => toggleSort('moq')} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  MOQ {sortConfig.key === 'moq' ? (sortConfig.direction === 'asc' ? '⬆️' : '⬇️') : ''}
                </th>
              )}
              {visibleColumns.actions && <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderTopRightRadius: '12px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((prod) => (<tr key={prod.id} style={{ transition: 'background-color 0.15s ease-in-out' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                {visibleColumns.image && (
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <img src={prod.thumbnail} alt={prod.title}
                         style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} // Slightly larger, rounded, subtle border
                         onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/cccccc/333333?text=No+Image`; }}
                    />
                  </td>
                )}
                
                {visibleColumns.title && (
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                    {editingId === prod.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="text" value={editedTitle} onChange={handleTitleChange} style={{
                            flexGrow: 1, padding: '0.5rem', border: '1px solid #a5b4fc', borderRadius: '4px',
                            boxShadow: '0 0 0 2px rgba(165, 180, 252, 0.5)', outline: 'none'
                          }}
                        />
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em' , padding: '0.2em' }} onClick={() => handleTitleBlur(prod.id)}>✅</button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em' , padding: '0.2em' }} onClick={() => cancelTitleEdit(prod.title)}>❌</button>
                      </div>
                    ) : (
                      <span onClick={() => handleTitleClick(prod.id, prod.title)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <span style={{ color: '#4f46e5', fontSize: '1.2em' }}>🖉</span> {prod.title} 
                      </span>
                    )}
                  </td>
                )}
                {visibleColumns.brand && <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{prod.brand}</td>}
                {visibleColumns.category && <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{prod.category}</td>}
                {visibleColumns.price && <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>${prod.price}</td>}
                {visibleColumns.rating && <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{prod.rating}</td>}
                {visibleColumns.returnPolicy && <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{prod.returnPolicy || 'N/A'}</td>}
                {visibleColumns.moq && (
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                    {editingMOQId === prod.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="number" value={editedMOQ} onChange={handleMOQChange}
                          style={{
                            flexGrow: 1, padding: '0.5rem', border: '1px solid #a5b4fc', borderRadius: '4px',
                            boxShadow: '0 0 0 2px rgba(165, 180, 252, 0.5)', outline: 'none'
                          }}
                        />
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em', padding: '0.2em' }} onClick={() => handleMOQBlur(prod.id)}>✅</button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em', padding: '0.2em' }} onClick={() => cancelMOQEdit(prod.minimumOrderQuantity)}>❌</button>
                      </div>
                    ) : (
                      <span onClick={() => handleMOQClick(prod.id, prod.minimumOrderQuantity)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <span style={{ color: '#4f46e5', fontSize: '1.2em' }}>🖉</span> {prod.minimumOrderQuantity ?? 'N/A'}
                      </span>
                    )}
                  </td>
                )}
                {visibleColumns.actions && (
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      style={{
                        background: '#ef4444', 
                        color: 'white',
                        border: 'none',
                        padding: '0.05rem 0.75rem',
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem', 
                        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                        transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                    >
                      🗑 Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!loading && !error && paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={Object.values(visibleColumns).filter(Boolean).length} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', fontSize: '1.1rem' }}>
                  No results found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{
        margin: '1rem 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        width: '100%',
        gap: '0.75rem' 
      }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            background: currentPage === 1 ? '#e5e7eb' : '#6366f1',
            color: currentPage === 1 ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            transition: 'background-color 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => { if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#4f46e5'; }}
          onMouseLeave={(e) => { if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#6366f1'; }}
        >
          ⬅ Prev
        </button>
        <span style={{ margin: '0 0.5rem', fontSize: '1rem', color: '#374151', fontWeight: '500' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 1rem',
            background: currentPage === totalPages ? '#e5e7eb' : '#6366f1',
            color: currentPage === totalPages ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            transition: 'background-color 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => { if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#4f46e5'; }}
          onMouseLeave={(e) => { if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#6366f1'; }}
        >
          Next ➡
        </button>
      </div>
      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        border: '1px solid #e5e7eb', 
        borderRadius: '12px', 
        background: '#ffffff', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', 
        width: '100%',
        maxWidth: '900px', 
        margin: '2rem auto' 
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center', color: '#1f2937' }}>Add New Product</h2> 
        <form
          onSubmit={(e) => { e.preventDefault();
            const newProduct = {
              id: Date.now(),
              title: e.target.title.value,
              brand: e.target.brand.value,
              category: e.target.category.value,
              price: parseFloat(e.target.price.value),
              rating: parseFloat(e.target.rating.value),
              returnPolicy: e.target.returnPolicy.value,
              moq: parseInt(e.target.moq.value),
              thumbnail: e.target.thumbnail.value,
            };
            setProducts((prev) => [newProduct, ...prev]);
            e.target.reset();
          }}
          style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}
        >
          <input name="title" placeholder="Title" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <input name="brand" placeholder="Brand" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <input name="category" placeholder="Category" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <input name="price" type="number" step="0.01" placeholder="Price" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <input name="rating" type="number" step="0.1" placeholder="Rating" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <input name="moq" type="number" placeholder="MOQ" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <input name="returnPolicy" placeholder="Return Policy" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <input name="thumbnail" placeholder="Image URL" required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#6366f1'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
          <button
            type="submit" style={{
              padding: '0.75rem 1.5rem',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
          >
            ➕ Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
export default ProductTable;
