// --- 1. 個別Markdownページの読み込み（post.html用） ---
document.addEventListener('DOMContentLoaded', () => {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  const params = new URLSearchParams(window.location.search);
  const fileName = params.get('file');

  if (!fileName) {
    contentEl.innerHTML = '<p>指定された記事が見つかりません。</p>';
    return;
  }

  fetch(`content/${fileName}`)
    .then(response => {
      if (!response.ok) throw new Error('File not found');
      return response.text();
    })
    .then(markdownText => {
      contentEl.innerHTML = marked.parse(markdownText);
    })
    .catch(err => {
      contentEl.innerHTML = `<p>記事の読み込みに失敗しました (${err.message})。</p>`;
    });
});


// --- 2. テーマ切替機能 ---
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
});


// --- 3. Home画面 & 山行記録一覧のカード生成（2段コンパクト構成） ---
document.addEventListener('DOMContentLoaded', () => {
  const homeContainer = document.getElementById('post-list');
  const allContainer = document.getElementById('all-posts-list');

  if (!homeContainer && !allContainer) return;

  fetch('content/posts/posts.json')
    .then(response => {
      if (!response.ok) throw new Error('posts.jsonが見つかりません');
      return response.json();
    })
    .then(posts => {
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      const createCardHtml = (post) => `
        <a href="post.html?file=${post.file}" class="card">
          <div class="card-content">
            <p class="card-date">${post.date.replace(/-/g, '.')}</p>
            <h3 class="card-title">${post.title}</h3>
          </div>
        </a>
      `;

      if (homeContainer) {
        const latestPosts = posts.slice(0, 6);
        homeContainer.innerHTML = latestPosts.map(createCardHtml).join('');
      }

      if (allContainer) {
        allContainer.innerHTML = posts.map(createCardHtml).join('');
      }
    })
    .catch(error => {
      console.error('記事の読み込みに失敗しました:', error);
      if (homeContainer) homeContainer.innerHTML = '<p>記事を読み込めませんでした。</p>';
      if (allContainer) allContainer.innerHTML = '<p>記事を読み込めませんでした。</p>';
    });
});
