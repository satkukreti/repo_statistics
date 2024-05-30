document.getElementById('user-form').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';
  
    try {
      const response = await fetch(`/api/user/${username}`);
      const data = await response.json();
  
      if (response.ok) {
        const { totalRepos, totalForks, totalStars, averageRepoSizeMB, languages } = data;
        resultDiv.innerHTML = `
          <div class="card">
            <div class="card-body">
              <p class="card-text"><strong>Total Repositories:</strong> ${totalRepos}</p>
              <p class="card-text"><strong>Total Fork Count:</strong> ${totalForks}</p>
              <p class="card-text"><strong>Total Stargazers Count:</strong> ${totalStars}</p>
              <p class="card-text"><strong>Average Repository Size:</strong> ${averageRepoSizeMB} MB</p>
              <h5 class="card-title"><strong>Languages Used:</strong></h5>
              <ul class="list-group list-group-flush">
                ${languages.map(lang => `<li class="list-group-item">${lang.language}: ${lang.count}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      } else {
        resultDiv.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
      }
    } catch (error) {
      resultDiv.innerHTML = `<div class="alert alert-danger">Error fetching data. Please try again later.</div>`;
    }
  });
  