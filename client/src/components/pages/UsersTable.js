import React, { useEffect, useState } from "react";
import { Table, Button, Input, Popconfirm, message } from "antd";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../../api/users";
import { UserForm } from "./UserForm";

export const UsersTable = ({ showModal, visible, onCancel }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [originalUsers, setOriginalUsers] = useState([]);

  const columns = [
    {
      title: "User Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, user) => (
        <div>
          <Button type="primary" onClick={() => handleUpdateUserButton(user)}>
            Update User
          </Button>
          <Popconfirm
            title="Associated certificates will be deleted permanently as well.
            Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(user.email)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      const data = response.emails.map((email) => ({ email }));
      setUsers(data);
      setOriginalUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUserButton = async (user) => {
    try {
      setLoading(true);
      const response = await getUser(user.email);
      setUser(response.user);
      showModal();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const handleDeleteUser = async (email) => {
    try {
      setLoading(true);
      const response = await deleteUser({ email });
      if (response.success) {
        message.success("User deleted successfully.");
        const response = await getAllUsers();
        const data = response.emails.map((email) => ({ email }));
        setUsers(data);
        setOriginalUsers(data);
        setLoading(false);
      } else {
        setLoading(false);
        message.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete user.");
      console.error(error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterUsers(value);
  };

  const filterUsers = (searchText) => {
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      const filteredUsers = originalUsers.filter((user) => {
        const lowerCaseUserEmail = user.email.toLowerCase();
        return lowerCaseUserEmail.includes(lowerCaseSearchText);
      });
      setUsers(filteredUsers);
    } else {
      setUsers(originalUsers);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <UserForm user={user} visible={visible} onCancel={onCancel} />
      <div>
        <Input
          placeholder="Search by User Email"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="email"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: users.length,
            onChange: handlePageChange,
            style: { textAlign: "center" },
          }}
        />
      </div>
    </>
  );
};
