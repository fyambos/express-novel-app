import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

const StoryEdit = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const user = useAuth();
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/stories/${storyId}`);
        const data = await response.json();
        setStory(data);
        setValue("title", data.title);
        setValue("summary", data.summary);
        setValue("rating", data.rating);
        setValue("tags", data.tags);
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const { title, summary, rating, tags } = data;

      const response = await fetch(`http://localhost:5000/api/stories/${storyId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, author: user.uid }),
      });

      if (!response.ok) {
        throw new Error(`Error updating story: ${response.statusText}`);
      }

      const updatedStory = await response.json();
      navigate(`/stories/${updatedStory._id}`);
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  if (!story) {
    return (
        
      <div className="flex justify-center h-screen bg-gray-100 pt-4 dark:bg-gray-800">
      <div className="flex flex-col items-center w-full max-w-lg space-y-4 animate-pulse">
        <div className="w-full h-12 bg-gray-300 rounded dark:bg-gray-700"></div>
        <div className="w-full h-48 bg-gray-300 rounded-lg dark:bg-gray-700"></div>
        <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
        <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
      </div>
    </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Edit Story</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            {...register("title", { required: true })}
          />
          {errors.title && <span className="text-red-500 dark:text-red-400">Title is required</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Summary
          </label>
          <textarea
            id="summary"
            rows={4}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            {...register("summary", { required: true })}
          />
          {errors.summary && <span className="text-red-500 dark:text-red-400">Summary is required</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Rating
          </label>
          <select
            id="rating"
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            {...register("rating", { required: true })}
          >
            <option value="">Select Rating</option>
            <option value="General Audiences">General Audiences</option>
            <option value="Teen">Teen</option>
            <option value="Mature">Mature</option>
          </select>
          {errors.rating && <span className="text-red-500 dark:text-red-400">Rating is required</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            {...register("tags")}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Story
        </button>
      </form>
    </div>
  );
};

export default StoryEdit;
