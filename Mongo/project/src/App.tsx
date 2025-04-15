import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Person {
  _id: string;
  name: string;
  age: number;
  gender: string;
  mobileNumber: string;
}

function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobileNumber: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const response = await fetch('http://localhost:3000/person');
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:3000/person/${editingId}`
        : 'http://localhost:3000/person';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          mobileNumber: formData.mobileNumber
        }),
      });

      if (response.ok) {
        setFormData({ name: '', age: '', gender: '', mobileNumber: '' });
        setEditingId(null);
        setIsFormVisible(false);
        fetchPersons();
      }
    } catch (error) {
      console.error('Error saving person:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        const response = await fetch(`http://localhost:3000/person/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPersons();
        }
      } catch (error) {
        console.error('Error deleting person:', error);
      }
    }
  };

  const handleEdit = (person: Person) => {
    setFormData({
      name: person.name,
      age: person.age.toString(),
      gender: person.gender,
      mobileNumber: person.mobileNumber
    });
    setEditingId(person._id);
    setIsFormVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Person Management</h1>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={20} />
            Add Person
          </button>
        </div>

        {isFormVisible && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormVisible(false);
                  setEditingId(null);
                  setFormData({ name: '', age: '', gender: '', mobileNumber: '' });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {persons.map((person) => (
                <tr key={person._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{person.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{person.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{person.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{person.mobileNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(person._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;