import axios from 'axios';

export const getLatestCommit = async (user: string, repo: string): Promise<string> => {
  try {
    // Dynamic URL based on user and repo
    const url = `https://api.github.com/repos/${user}/${repo}/commits/main`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    // Extract the commit SHA string
    const commitSha = response.data.sha;
    return commitSha;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error with Axios request:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
