const repoItem = (repo) => {
  return `
      <li class='repos-item'>
        <div>${repo.full_name}</div>
        <div><a target='_blank' href="${repo.html_url}">Link</a></div>
      </li>
   `;
};

export default repoItem;
