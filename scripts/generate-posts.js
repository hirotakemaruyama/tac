const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../content/posts');
const jsonPath = path.join(postsDir, 'posts.json');

fs.readdir(postsDir, (err, files) => {
  if (err) {
    console.error('ディレクトリの読み込みに失敗しました:', err);
    process.exit(1);
  }

  const posts = [];

  files.forEach(file => {
    // .mdファイルかつ posts.json 以外を対象にする
    if (file.endsWith('.md') && file !== 'posts.json') {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // ファイル名の先頭から日付 (YYYYMMDD) を抽出
      const dateMatch = file.match(/^(\d{4}\d{2}\d{2})/);
      const date = dateMatch ? dateMatch[1] : '20260101';

      // Markdownの最初の行（# 見出し）をタイトルとして抽出
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

      posts.push({
        file: `posts/${file}`,
        date: date,
        tag: "山行記録", // 必要に応じて変更可能
        title: title,
        summary: "詳細はこちらからご覧ください。"
      });
    }
  });

  // 日付の新しい順（降順）にソート
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // posts.json として書き出す
  fs.writeFileSync(jsonPath, JSON.stringify(posts, null, 2), 'utf8');
  console.log('posts.json を自動生成しました。');
});