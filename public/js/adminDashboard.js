console.log("running dashboard script!");

// Handle Users.....................................................
// Admin login details
async function insertAdmin() {
    const hashedPassword = await bcrypt.hash('admin2023', 10);

    const adminUser = new UserSign({
        userName: 'admin',
        location: 'Grand Baie',
        yearGroup: '2000',
        password: hashedPassword,
        role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user inserted successfully.');
    mongoose.connection.close();
}

// Fetch and display user details when the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchUsers();
});

// Display users
function fetchUsers() {
    fetch('/api/user/allUsers')
        .then(response => response.json())
        .then(users => {
            displayUsers(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}

function getElementById(id) {
    return document.getElementById(id);
}

// Function to open the edit event modal with user ID
function openEditUserModal(userId) {
    console.log('Function called with userId:', userId);
    console.log('we can update');
    if (!userId) {
        console.error('Invalid userId:', userId);
        return;
    }

    fetch(`/api/user/${userId}`)
        .then(response => {
           
            if (!response.ok) {
                throw new Error(`Failed to fetch user details. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('editUserModal').style.display = 'block';
            document.getElementById('userName1').value = user.userName;
            document.getElementById('location1').value = user.location;
            document.getElementById('yearGroup1').value = user.yearGroup;

            currentUserID = user._id;

            // Pass the userId to the submitEditUserForm function
            document.getElementById(`editButton-${user._id}`).onclick = function () {
                console.log('UID', user._id)
                //submitEditUserForm(user._id);
            };
            
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}

function displayUsers(users) {
    const userListContainer = document.getElementById('userList');
    userListContainer.innerHTML = '';

    users.forEach(user => {
        const userDiv = document.createElement('div');
        const editButtonId = `editButton-${user._id}`;

        userDiv.innerHTML = `
            <p>Username: ${user.userName}</p>
            <p>Location: ${user.location}</p>
            <p>Year Group: ${user.yearGroup}</p>
            <button class="updateButton" id="${editButtonId}">Edit</button>
            <button class="updateButton" onclick="deleteUser('${user._id}')">Delete</button>
            <hr>
        `;

        userListContainer.appendChild(userDiv);

        // Attach event listener to the parent container using event delegation
        userListContainer.addEventListener('click', function(event) {
            if (event.target.id === editButtonId) {
                openEditUserModal(user._id);
            }
        });
    });
}

let currentUserID;

// Function to submit the edit user form using AJAX
async function submitEditUserForm(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get form data
    const editUserData = {
        userName: document.getElementById('userName1').value,
        location: document.getElementById('location1').value,
        yearGroup: document.getElementById('yearGroup1').value,
    };
     
    try {
        // Use AJAX to send the form data to update the user
        const response = await fetch(`/api/user/${currentUserID}/updateUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editUserData),
        });

        if (!response.ok) {
            throw new Error(`Update user failed. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Update successful:', data);
        // Optionally, you can update the UI without reloading the page
        // For example, by updating the user list or showing a success message
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

// Function to close the edit user modal
function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Function to delete a user
function deleteUser(userId) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    console.log("the function is deleting")

    if (confirmDelete) {
        fetch(`/api/user/${userId}/deleteUser`, {
            method: 'DELETE',
        })
            .then(response => {
                console.log("deleted success")

                if (response.ok) {
                    console.log('User deleted successfully');
                    // Optionally, you can reload the page or update the user list
                    window.location.reload();
                } else {
                    console.error('Error deleting user:', response.status);
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    }
}
