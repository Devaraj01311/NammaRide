import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useFetchCaptain = () => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaptain = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCaptain(response.data);
      } catch (err) {
        console.error("Error fetching captain:", err);

        if (err.response?.status === 401) {
          // Token invalid or expired
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCaptain();
  }, [navigate]);

  return { captain, loading };
};

export default useFetchCaptain;
