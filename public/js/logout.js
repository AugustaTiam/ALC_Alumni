function logout() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (confirmLogout) {

        window.location.href = 'login.html';
    } else {
    }
}