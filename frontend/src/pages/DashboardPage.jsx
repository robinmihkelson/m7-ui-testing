import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/auth.js";
import { getBooks, getMyReservations } from "../services/api.js";
import Navbar from "../components/Navbar.jsx";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalBooks: 0, myReservations: 0 });

  useEffect(() => {
    Promise.all([getBooks(), getMyReservations()])
      .then(([books, reservations]) => {
        setStats({ totalBooks: books.length, myReservations: reservations.length });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <div className="container page">
        <h1 className="page-title" data-testid="dashboard-title">
          Welcome, {user?.name}
        </h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalBooks}</div>
            <div className="stat-label">Total Books</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.myReservations}</div>
            <div className="stat-label">My Reservations</div>
          </div>
        </div>

        <div className="section-heading">Quick links</div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/books" className="btn btn-secondary" data-testid="dashboard-link-books">
            Browse Books
          </Link>
          <Link to="/my-reservations" className="btn btn-secondary" data-testid="dashboard-link-reservations">
            My Reservations
          </Link>
          {user?.role === "admin" && (
            <>
              <Link to="/admin/books" className="btn btn-secondary" data-testid="dashboard-link-admin-books">
                Admin: Books
              </Link>
              <Link to="/admin/reservations" className="btn btn-secondary" data-testid="dashboard-link-admin-reservations">
                Admin: Reservations
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
