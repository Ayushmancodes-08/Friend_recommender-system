document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('all-users-list');
    const recommendationsList = document.getElementById('recommendations-list');
    
    const formAddUser = document.getElementById('form-add-user');
    const formAddFriendship = document.getElementById('form-add-friendship');
    const formGetRecommendations = document.getElementById('form-get-recommendations');
    const btnRefreshUsers = document.getElementById('btn-refresh-users');

    const API_URL = '/api';

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            
            const users = await response.json();
            
            userList.innerHTML = '';
            if (users.length === 0) {
                userList.innerHTML = '<li class="text-gray-500 text-center py-4">No users in the network yet.</li>';
                return;
            }

            users.forEach(user => {
                const li = document.createElement('li');
                const friendsText = user.friends.length > 0 ? user.friends.join(', ') : 'None';
                li.className = 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200';
                li.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-2">
                                <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    ${user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">${user.name}</p>
                                    <p class="text-xs text-gray-500">ID: ${user.id}</p>
                                </div>
                            </div>
                            <div class="mt-2 ml-12">
                                <p class="text-sm text-gray-600 flex items-center">
                                    <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    ${user.location}
                                </p>
                                <p class="text-sm text-gray-600 mt-1">
                                    <span class="font-medium">Friends:</span> 
                                    <span class="text-indigo-600">${friendsText}</span>
                                </p>
                            </div>
                        </div>
                        <button class="delete-user-btn ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200" data-username="${user.name}" title="Delete user">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                `;
                userList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            userList.innerHTML = '<li class="text-red-500 text-center py-4">Error loading users.</li>';
        }
    };

    formAddUser.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value;
        const location = document.getElementById('user-location').value;
        
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, location })
            });

            if (response.ok) {
                alert('User added successfully!');
                formAddUser.reset();
                fetchAllUsers();
            } else {
                alert('Error: User might already exist.');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('A network error occurred.');
        }
    });

    formAddFriendship.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name1 = document.getElementById('friend-name1').value;
        const name2 = document.getElementById('friend-name2').value;

        try {
            const response = await fetch(`${API_URL}/friendships`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name1, name2 })
            });
            
            const message = await response.text();
            alert(message);

            if (response.ok) {
                formAddFriendship.reset();
                fetchAllUsers();
            }
        } catch (error) {
            console.error('Error adding friendship:', error);
            alert('A network error occurred.');
        }
    });

    formGetRecommendations.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('rec-user-name').value;
        recommendationsList.innerHTML = '<div class="text-center py-4"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div></div>';

        try {
            const response = await fetch(`${API_URL}/users/${name}/recommendations`);

            if (!response.ok) {
                if (response.status === 404) {
                    recommendationsList.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">User not found.</div>';
                } else {
                    throw new Error('Server error');
                }
                return;
            }

            const recommendations = await response.json();
            recommendationsList.innerHTML = `<h3 class="text-lg font-semibold text-gray-800 mb-3">Top Recommendations for ${name}:</h3>`;

            if (recommendations.length === 0) {
                recommendationsList.innerHTML += '<div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">No recommendations found. Try making more connections!</div>';
                return;
            }

            recommendations.slice(0, 3).forEach((rec, index) => {
                const reason = rec.sameLocation
                    ? `${rec.mutualFriendsCount} mutual friend(s), and is also in your location`
                    : `${rec.mutualFriendsCount} mutual friend(s)`;
                
                const div = document.createElement('div');
                div.className = 'bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4 mb-3 hover:shadow-md transition-all duration-200';
                div.innerHTML = `
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            ${index + 1}
                        </div>
                        <div class="ml-3 flex-1">
                            <p class="font-semibold text-gray-900">${rec.name}</p>
                            <p class="text-sm text-gray-600 mt-1 flex items-center">
                                <svg class="w-4 h-4 mr-1 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                ${reason}
                            </p>
                            ${rec.sameLocation ? '<span class="inline-block mt-2 bg-pink-100 text-pink-700 text-xs font-medium px-2 py-1 rounded">Same Location</span>' : ''}
                        </div>
                    </div>
                `;
                recommendationsList.appendChild(div);
            });

        } catch (error) {
            console.error('Error getting recommendations:', error);
            recommendationsList.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">Error loading recommendations.</div>';
        }
    });

    btnRefreshUsers.addEventListener('click', fetchAllUsers);

    // Delete user handler (using event delegation)
    userList.addEventListener('click', async (e) => {
        const deleteBtn = e.target.closest('.delete-user-btn');
        if (!deleteBtn) return;

        const username = deleteBtn.dataset.username;
        if (!confirm(`Are you sure you want to delete ${username}?`)) return;

        try {
            const response = await fetch(`${API_URL}/users/${username}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert(`${username} deleted successfully!`);
                fetchAllUsers();
            } else {
                alert('Failed to delete user.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('A network error occurred.');
        }
    });

    fetchAllUsers();
});
