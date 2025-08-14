import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const departments = ["Engineering", "Marketing", "HR", "Finance", "Sales", "Operations"];

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredName, setFilteredName] = useState("");
  const [filteredDept, setFilteredDept] = useState("");
  const [statusFilter, setStatusFilter] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    role: "",
    salary: "",
    status: "Active",
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://recruitly-employee-management.onrender.com/api/employees", {
        params: {
          name: filteredName,
          department: filteredDept,
          status: statusFilter ? "Active" : "",
        },
      });
      setEmployees(res.data);
    } catch (err) {
      alert("Error fetching employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filteredName, filteredDept, statusFilter]);

  const openModal = (data = null) => {
    setEditData(data);
    setModalOpen(true);
    setFormData(
      data || {
        name: "",
        department: "",
        role: "",
        salary: "",
        status: "Active",
      }
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://recruitly-employee-management.onrender.com/api/employees/${id}`);
      fetchEmployees();
      alert("Employee deleted");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.role || !formData.salary) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editData) {
        await axios.put(`https://recruitly-employee-management.onrender.com/api/employees/${editData._id}`, formData);
        alert("Employee updated");
      } else {
        await axios.post("https://recruitly-employee-management.onrender.com/api/employees", formData);
        alert("Employee added");
      }
      setModalOpen(false);
      fetchEmployees();
    } catch (err) {
      alert("Failed to save employee");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-6 text-white">
      <motion.div
        className="max-w-screen-xl mx-auto bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-2">
          RECRUITLY
        </h1>
        <h2 className="text-2xl text-center text-cyan-300 mb-8 tracking-wide">
          Employee Management Dashboard
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name"
              className="pl-9 border border-white/30 bg-white/20 text-white rounded-lg px-3 py-2 w-52 placeholder-gray-300 focus:ring-2 focus:ring-pink-400"
              onChange={(e) => setFilteredName(e.target.value)}
            />
          </div>
          <select
            className="border border-white/30 bg-white/20 text-white rounded-lg px-3 py-2 w-52 focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFilteredDept(e.target.value)}
            defaultValue=""
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept} className="text-black">
                {dept}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={statusFilter}
              onChange={(e) => setStatusFilter(e.target.checked)}
              className="accent-pink-500"
            />
            Active Only
          </label>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:scale-105 transform transition px-5 py-2 rounded-lg shadow-lg"
          >
            Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-white/20 rounded-lg shadow-lg">
          <table className="w-full table-auto border-collapse text-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <th className="p-3 border border-white/20">Name</th>
                <th className="p-3 border border-white/20">Department</th>
                <th className="p-3 border border-white/20">Role</th>
                <th className="p-3 border border-white/20">Salary</th>
                <th className="p-3 border border-white/20">Status</th>
                <th className="p-3 border border-white/20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <motion.tr
                  key={emp._id}
                  className="bg-white/10 hover:bg-white/20 transition"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="p-3 border border-white/20">{emp.name}</td>
                  <td className="p-3 border border-white/20">{emp.department}</td>
                  <td className="p-3 border border-white/20">{emp.role}</td>
                  <td className="p-3 border border-white/20">{emp.salary}</td>
                  <td className="p-3 border border-white/20">{emp.status}</td>
                  <td className="p-3 border border-white/20">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(emp)}
                        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td className="p-3 text-center border border-white/20" colSpan="6">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">
                {editData ? "Edit" : "Add"} Employee
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="border px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <select
                  className="border px-3 py-2 rounded"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Role"
                  className="border px-3 py-2 rounded"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Salary"
                  className="border px-3 py-2 rounded"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
                <select
                  className="border px-3 py-2 rounded"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {editData ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;  