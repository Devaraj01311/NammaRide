import { createContext, useState } from 'react';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalTrips: 0,
        totalHoursOnline: 0,
        totalKm: 0  
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCaptain = (captainData, statsData) => {
        setCaptain(captainData);
        if (statsData) setStats(statsData);
    };

    return (
        <CaptainDataContext.Provider value={{
            captain,
            stats,
            setCaptain,
            setStats,
            isLoading,
            setIsLoading,
            error,
            setError,
            updateCaptain
        }}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
