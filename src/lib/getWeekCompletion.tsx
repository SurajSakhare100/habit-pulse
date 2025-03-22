export const getWeekCompletion = async () => {
    const response = await fetch('/api/habits/week-completion', {
      credentials: 'include', // For session cookies
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  };