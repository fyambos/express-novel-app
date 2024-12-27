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
          const author = await fetchAuthor(data.author);
          setStory({ ...data, author: author });
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
      <div className="flex justify-center h-screen bg-gray-100 pt-4 dark:bg-gray-800">
      <div className="flex flex-col items-center w-full max-w-lg space-y-4 animate-pulse">
        <div className="w-full h-12 bg-gray-300 rounded dark:bg-gray-700"></div>
        <div className="w-3/4 h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
        <div className="w-full h-48 bg-gray-300 rounded-lg dark:bg-gray-700"></div>
        <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
        <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
      </div>
    </div>
    
    );
  }

  const isAuthor = user?.uid === story.author.id; 

  return (
    <div className="container mx-auto p-4 text-center"> 
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
      <h3 className="text-xl font-semibold mb-2">Author: {story.author.username }</h3>
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
      {isAuthor && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate(`/stories/${story._id}/edit`)} 
        >
          Edit Story
        </button>
      )}
    </div>
  );
};

const fetchAuthor = async (authorId: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${authorId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('The api did not return a valid response');
      return '';
    }
  } catch (error) {
    console.error('Error fetching username:', error);
    return '';
  }
};

export default StoryDetails;