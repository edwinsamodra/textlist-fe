import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TextList() {
  const [textItems, setTextItems] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all text items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/items`);
      setTextItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items. Please try again later.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new text item
  const handleAddText = async () => {
    if (newText.trim() === '') return;

    try {
      setLoading(true);
      await axios.post(`${API_URL}/items`, { text: newText });
      setNewText('');
      fetchItems(); // Refresh the list
    } catch (err) {
      setError('Failed to add item. Please try again.');
      console.error('Error adding item:', err);
      setLoading(false);
    }
  };

  // Delete text item
  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/items/${id}`);
      fetchItems(); // Refresh the list
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error('Error deleting item:', err);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddText();
    }
  };

  // Load items when component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daftar Text</h1>
      
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 p-2 rounded flex-grow"
          placeholder="Masukkan text baru..."
          disabled={loading}
        />
        <button 
          onClick={handleAddText}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading || newText.trim() === ''}
        >
          {loading ? 'Loading...' : 'Tambah'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && !textItems.length ? (
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Text</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {textItems.map((item, index) => (
                <tr key={item._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.text}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                      disabled={loading}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && textItems.length === 0 && (
        <p className="text-gray-500 text-center mt-4">Belum ada item dalam daftar</p>
      )}
    </div>
  );
}