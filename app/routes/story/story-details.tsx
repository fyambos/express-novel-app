import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Story } from '../../types/story';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const StoryDetails = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/stories/${storyId}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
        } else {
          navigate('/not-found');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [storyId, navigate]);

  if (!story) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 text-center"> 
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
      <h3 className="text-xl font-semibold mb-2">Summary:</h3>
      <p className="text-lg mb-4">{story.summary}</p>

      <div className="flex flex-col space-y-2 pb-4">
        <h3 className="text-xl font-semibold">Rating:</h3>
        <p>{story.rating}</p>
      </div>

      <div className="flex flex-col space-y-2 pb-4">
        <h3 className="text-xl font-semibold">Tags:</h3>
        <ul className="list-disc ml-4">
          {story.tags.map((tag) => (
            <p key={tag}>{tag}</p>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StoryDetails;