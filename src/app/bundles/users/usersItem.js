const usersItem = (user) => {
  return `
      <div class='user-item col-3'>
        <div>
            <img src="${user.avatar_url}" alt="">
            <h1>${user.login}</h1>
        </div>
      </div>
   `;
};

export default usersItem;
