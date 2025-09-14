// Configuration
const API_BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const STORIES_TO_FETCH = 10;

// Fetch stories from Hacker News API
async function fetchHackerNewsStories() {
  try {
    const storiesContainer = document.getElementById('hackernews-stories');
    if (!storiesContainer) {
      console.error('Stories container element not found');
      return;
    }

    // Show loading state
    storiesContainer.innerHTML = '<p>Loading stories...</p>';

    const response = await fetch(`${API_BASE_URL}/newstories.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const storyIds = await response.json();
    const stories = await Promise.all(
      storyIds
        .slice(0, STORIES_TO_FETCH)
        .map(id => fetchStory(id))
    );

    // Filter out any null results from failed story fetches
    const validStories = stories.filter(story => story !== null);
    displayStories(validStories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    document.getElementById('hackernews-stories').innerHTML = 
      '<p>Error loading stories. Please try again later.</p>';
  }
}

// Fetch individual story details
async function fetchStory(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/item/${id}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const story = await response.json();
    return story;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return null;
  }
}

// Display stories in the container
function displayStories(stories) {
  const storiesContainer = document.getElementById('hackernews-stories');
  
  if (stories.length === 0) {
    storiesContainer.innerHTML = '<p>No stories available at the moment.</p>';
    return;
  }

  const storiesHTML = stories.map(story => {
    // Handle cases where story.url might be undefined (like for Ask HN posts)
    const title = story.title || 'Untitled';
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    const timestamp = new Date(story.time * 1000).toLocaleString();
    
    return `
      <div class="story">
        <h2><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></h2>
        <p>By ${story.by || 'anonymous'} | ${story.score || 0} points | ${timestamp}</p>
      </div>
    `;
  }).join('');

  storiesContainer.innerHTML = storiesHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchHackerNewsStories);

// Optional: Add refresh functionality
function addRefreshButton() {
  const button = document.createElement('button');
  button.textContent = 'Refresh Stories';
  button.onclick = fetchHackerNewsStories;
  document.getElementById('hackernews-stories').before(button);
}

document.addEventListener('DOMContentLoaded', addRefreshButton);