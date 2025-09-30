/**
 * Adjacent Science - Main Scripts
 * Handles dark mode toggle and Substack feed loading
 */

// ===== DARK MODE TOGGLE =====

/**
 * Initialize dark mode based on user preference
 */
function initDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    updateThemeIcon();
}

/**
 * Toggle between light and dark mode
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }

    updateThemeIcon();
}

/**
 * Update the theme toggle icon
 */
function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        if (isDark) {
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// ===== SUBSTACK FEED LOADER =====

const SUBSTACK_FEED_URL = 'https://www.ersatzben.com/feed';
const MAX_POSTS = 4;

// Fallback posts in case API fails
const FALLBACK_POSTS = [
    {
        title: "We've made public science boring. It's time to make it magnificent.",
        link: "https://www.ersatzben.com/p/weve-made-public-science-boring-its",
        pubDate: "2025-09-01T00:00:00Z",
        description: "An essay on the urgency of 'demonstration statecraft' – a way of building that pairs theatrical ambition with democratic delivery."
    },
    {
        title: "What Actually Counts as Interdisciplinary Research?",
        link: "https://www.ersatzben.com/p/what-actually-counts-as-interdisciplinary",
        pubDate: "2025-07-09T00:00:00Z",
        description: "A data-driven look at which funders support knowledge integration"
    },
    {
        title: "The future of research belongs to those with clarity of purpose",
        link: "https://www.ersatzben.com/p/the-future-of-research-belongs-to",
        pubDate: "2025-06-06T00:00:00Z",
        description: "Replacing US leadership means tackling fundamental questions about our research institutions' role in society"
    },
    {
        title: "Tips for new advisers in government",
        link: "https://www.ersatzben.com/p/tips-for-new-advisers-in-government",
        pubDate: "2025-05-28T00:00:00Z",
        description: "What I wish someone had told me. Now sharing for interest!"
    }
];

/**
 * Formats a date string into a readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Strips HTML tags and extracts plain text from HTML content
 */
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

/**
 * Truncates text to a specified length with ellipsis
 */
function truncateText(text, maxLength = 150) {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength).trim() + '...';
}

/**
 * Creates a post card element
 */
function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';

    const date = document.createElement('div');
    date.className = 'post-date';
    date.textContent = formatDate(post.pubDate);

    const title = document.createElement('h4');
    title.className = 'post-title';
    const link = document.createElement('a');
    link.href = post.link;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = post.title;
    title.appendChild(link);

    const excerpt = document.createElement('p');
    excerpt.className = 'post-excerpt';
    const description = stripHtml(post.description || post.content || '');
    excerpt.textContent = truncateText(description, 180);

    article.appendChild(date);
    article.appendChild(title);
    article.appendChild(excerpt);

    return article;
}

/**
 * Creates a loading skeleton for posts
 */
function createLoadingSkeleton() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;

    postsGrid.innerHTML = '';

    for (let i = 0; i < MAX_POSTS; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'post-card skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-date"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-excerpt"></div>
            <div class="skeleton-excerpt short"></div>
        `;
        postsGrid.appendChild(skeleton);
    }
}

/**
 * Shows error message
 */
function showError() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;

    postsGrid.innerHTML = `
        <div class="posts-error">
            <p>Unable to load recent posts. Please visit <a href="https://ersatzben.com/archive" target="_blank" rel="noopener">Ben's Substack</a> directly.</p>
        </div>
    `;
}

/**
 * Parses XML RSS feed
 */
function parseRSS(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const items = xmlDoc.querySelectorAll('item');
    const posts = [];

    items.forEach((item, index) => {
        if (index < MAX_POSTS) {
            const title = item.querySelector('title')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';
            const content = item.querySelector('content\\:encoded, encoded')?.textContent || description;

            posts.push({
                title: title.trim(),
                link: link.trim(),
                pubDate: pubDate,
                description: description.trim(),
                content: content.trim()
            });
        }
    });

    return posts;
}

/**
 * Fetches posts from Substack RSS feed
 */
async function fetchSubstackPosts() {
    // Try multiple CORS proxies in order
    const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
    ];

    for (const proxy of corsProxies) {
        try {
            const response = await fetch(proxy + encodeURIComponent(SUBSTACK_FEED_URL));

            if (!response.ok) {
                continue;
            }

            const text = await response.text();
            const posts = parseRSS(text);

            if (posts && posts.length > 0) {
                return posts;
            }
        } catch (error) {
            console.warn(`Proxy ${proxy} failed:`, error);
            continue;
        }
    }

    // If all proxies fail, throw error to trigger fallback
    throw new Error('All CORS proxies failed');
}

/**
 * Renders posts to the page
 */
function renderPosts(posts) {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;

    postsGrid.innerHTML = '';

    posts.forEach(post => {
        const postCard = createPostCard(post);
        postsGrid.appendChild(postCard);
    });
}

/**
 * Main initialization function
 */
async function initSubstackFeed() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) {
        console.warn('Posts grid element not found');
        return;
    }

    // Show loading state
    createLoadingSkeleton();

    try {
        const posts = await fetchSubstackPosts();

        if (posts && posts.length > 0) {
            renderPosts(posts);
            console.log('✓ Successfully loaded posts from Substack RSS feed');
        } else {
            // Use fallback posts
            console.log('Using fallback posts');
            renderPosts(FALLBACK_POSTS);
        }
    } catch (error) {
        // Use fallback posts instead of showing error
        console.log('RSS fetch failed, using fallback posts:', error.message);
        renderPosts(FALLBACK_POSTS);
    }
}

// Initialize when DOM is ready
function init() {
    // Initialize dark mode immediately (before DOM is fully loaded for faster rendering)
    initDarkMode();

    // Set up theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize Substack feed
    initSubstackFeed();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}