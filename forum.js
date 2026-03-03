const forumLatest = 'https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json';
const forumTopicUrl = 'https://forum.freecodecamp.org/t/';
const forumCategoryUrl = 'https://forum.freecodecamp.org/c/';
const avatarUrl = 'https://cdn.freecodecamp.org/curriculum/forum-latest';

const allCategories = {
  299: { category: 'Career Advice', className: 'career' },
  409: { category: 'Project Feedback', className: 'feedback' },
  417: { category: 'freeCodeCamp Support', className: 'support' },
  421: { category: 'JavaScript', className: 'javascript' },
  423: { category: 'HTML - CSS', className: 'html-css' },
  424: { category: 'Python', className: 'python' },
  432: { category: 'You Can Do This!', className: 'motivation' },
  560: { category: 'Back-End Development', className: 'backend' },
};

// Helper function to calculate time passed since the post was last active
const timeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Helper function to format view counts (e.g., 1000 -> 1k)
const viewCount = (views) => {
  if (views >= 1000) return `${Math.floor(views / 1000)}k`;
  return views;
};

// Helper function to determine the category label and CSS class
const forumCategory = (id) => {
  let category = 'General';
  let className = 'general';

  if (allCategories[id]) {
    category = allCategories[id].category;
    className = allCategories[id].className;
  }

  return `<a class="category ${className}" href="${forumCategoryUrl}${className}/${id}">${category}</a>`;
};

// Helper function to map user IDs to avatar images
const avatars = (posters, users) => {
  return posters.map((poster) => {
    const user = users.find((u) => u.id === poster.user_id);
    const avatarTemplate = user.avatar_template.replace('{size}', '30');
    const src = avatarTemplate.startsWith('/')
      ? `${avatarUrl}${avatarTemplate}`
      : avatarTemplate;

    return `<img src="${src}" alt="${user.name}" />`;
  }).join('');
};

// Function to process data and inject HTML into the table
const showLatestPosts = (data) => {
  const { users, topic_list } = data;
  const { topics } = topic_list;

  document.getElementById('posts-container').innerHTML = topics.map(
    ({ id, title, views, posts_count, slug, posters, category_id, bumped_at }) => {
      return `
        <tr>
          <td>
            <a class="post-title" target="_blank" href="${forumTopicUrl}${slug}/${id}">${title}</a>
            ${forumCategory(category_id)}
          </td>
          <td>
            <div class="avatar-container">
              ${avatars(posters, users)}
            </div>
          </td>
          <td>${posts_count - 1}</td>
          <td>${viewCount(views)}</td>
          <td>${timeAgo(bumped_at)}</td>
        </tr>
      `;
    }
  ).join('');
};

// Main function to fetch the JSON data from the API
const fetchData = async () => {
  try {
    const res = await fetch(forumLatest);
    const data = await res.json();
    showLatestPosts(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

fetchData();