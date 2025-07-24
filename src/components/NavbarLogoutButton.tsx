import { useNavigate } from "react-router-dom";
import { logout } from "@/integrations/supabase/logout";
import { useState } from "react";

export function NavbarLogoutButton() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // or "/" for landing page
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Logout</button>
      {showModal && (
        <div className="modal">
          <p>Are you sure you want to logout?</p>
          <button onClick={handleLogout}>Yes, Logout</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

// Inside your navbar JSX:
// <NavbarLogoutButton />