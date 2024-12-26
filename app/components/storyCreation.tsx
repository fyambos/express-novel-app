import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 

const StoryCreation = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [genres, setGenres] = useState<string[]>([]);

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/create', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Error creating story: ${response.statusText}`); 
      }
  
      const story = await response.json();
      navigate(`/stories/${story._id}`); 
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  const handleGenreChange = (event: any) => {
    const { value, checked } = event.target;
    if (checked) {
      setGenres([...genres, value]);
    } else {
      setGenres(genres.filter((genre) => genre !== value));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Create New Story</h1>
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
          {errors.summary && (
            <span className="text-red-500 dark:text-red-400">Summary is required</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="genres" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Genres
          </label>
          <div className="mt-1 space-y-2">
            <input 
              type="checkbox" 
              id="genre1" 
              value="Fantasy" 
              checked={genres.includes('Fantasy')} 
              onChange={handleGenreChange} 
              className="mr-2" 
            />
            <label htmlFor="genre1" className="text-gray-700 dark:text-gray-400">Fantasy</label>

            <input 
              type="checkbox" 
              id="genre2" 
              value="Science Fiction" 
              checked={genres.includes('Science Fiction')} 
              onChange={handleGenreChange} 
              className="mr-2" 
            />
            <label htmlFor="genre2" className="text-gray-700 dark:text-gray-400">Science Fiction</label>
          </div>
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
          Create Story
        </button>
      </form>
    </div>
  );
};

export default StoryCreation;