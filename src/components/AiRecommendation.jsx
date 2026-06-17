import { useState, useEffect } from 'react';
import './AiRecommendation.css';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const getMovieInsight = async (title, genres, overview) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          {
            role: 'system',
            content:
              "You are an enthusiastic but honest movie critic helping users decide if a film is worth their time tonight. Write compelling 2-3 sentence watch recommendations (40-80 words) that capture each movie's appeal without spoilers. Use third-person perspective, be specific to genres and themes, and focus on who would enjoy the film and why. Avoid generic phrases and comparisons unless truly helpful.",
          },
          {
            role: 'user',
            content: `Movie: ${title}\nGenres: ${genres}\nPlot: ${overview}\n\nWrite a 2-3 sentence watch recommendation for this film.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI insight failed:', error);
    return "We couldn't generate a recommendation for this one — check out the overview above!";
  }
};

// Self-contained AI recommendation feature: owns its own state + fetch so its
// async update (loading -> text) stays inside this component and does NOT
// re-render the parent modal / Backdrop / blur overlay.
const AiRecommendation = ({ title, genres, overview }) => {
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    if (!OPENROUTER_API_KEY || !title) {
      return;
    }

    let cancelled = false;

    const fetchAiInsight = async () => {
      setLoadingInsight(true);

      const genresString = genres?.map((g) => g.name).join(', ') || 'Unknown';
      const insight = await getMovieInsight(
        title,
        genresString,
        overview || 'No overview available.'
      );

      if (!cancelled) {
        setAiInsight(insight);
        setLoadingInsight(false);
      }
    };

    fetchAiInsight();

    return () => {
      cancelled = true;
    };
  }, [title, genres, overview]);

  if (!OPENROUTER_API_KEY) {
    return null;
  }

  return (
    <div className="modal-ai-section">
      <h3 className="modal-ai-title">✨ Watch Recommendation</h3>
      <div>
        {loadingInsight ? (
          <p className="modal-ai-loading">✨ Getting a recommendation...</p>
        ) : aiInsight ? (
          <p className="modal-ai-text">{aiInsight}</p>
        ) : (
          <p className="modal-ai-loading">✨ Preparing recommendation...</p>
        )}
      </div>
    </div>
  );
};

export default AiRecommendation;
