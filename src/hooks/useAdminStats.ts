import { useState, useEffect } from 'react';
import { User } from '@/types';

interface AdminStats {
  totalUsers: number;
  totalLocations: number;
  recentUsers: number;
  latestUsers: User[];
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalLocations: 0,
    recentUsers: 0,
    latestUsers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
} 