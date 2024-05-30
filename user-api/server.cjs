const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const githubApiUrl = `https://api.github.com/users/${username}/repos`;

  try {
    const response = await axios.get(githubApiUrl);
    const repos = response.data;

    let totalRepos = repos.length;
    let totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
    let totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    let totalSize = repos.reduce((acc, repo) => acc + repo.size, 0);
    let languageCounts = {};

    repos.forEach(repo => {
      const lang = repo.language;
      if (lang) {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      }
    });

    let sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => ({ language: entry[0], count: entry[1] }));

    let averageRepoSizeMB = totalSize / totalRepos;

    res.json({
      totalRepos,
      totalForks,
      totalStars,
      averageRepoSizeMB: (averageRepoSizeMB / 1024).toFixed(2),
      languages: sortedLanguages
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from GitHub' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});