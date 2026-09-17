document.addEventListener("DOMContentLoaded", () => {
    handleAuthWindow();
    const signupForm = document.getElementById("registerForm");

    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
    }

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
});

function handleAuthWindow() {
    if (getUserState() === "loggedInWithNoBlog") {
        window.location.href = "create-blog.html";
        return;
    }

    if (getUserState() === "loggedInWithBlog") {
        window.location.href = "dashboard.html";
        return;
    }
}

function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const users = getUsers();

    const existingEmail = users.find(user => user.email === email);

    if (existingEmail) {
        alert("An account with this email already exists.");
        return;
    }

    const existingUsername = users.find(user => user.username === username);

    if (existingUsername) {
        alert("An account with this username already exists.");
        return;
    }

    const newUser = {
        id: getNextUserID(),
        username: username,
        email: email,
        password: password,
        hasBlog: false
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem(
        "isLoggedIn",
        "false"
    );

    window.location.href = "login.html";
}

function getNextUserID() {
    const users = getUsers();
    if (users.length === 0) return 1;

    return users[users.length - 1].id + 1;
}

function handleLogin(event) {
    event.preventDefault();

    const email = 
        document.getElementById("email").value.trim();

    const password = 
        document.getElementById("password").value.trim();

    const users = getUsers();

    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert("Incorrect email or password.");
        return;
    }

    localStorage.setItem(
        "currentUserId",
        user.id
    );

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

    if (user.hasBlog) {
        window.location.href = "dashboard.html";
        return;
    } else {
        window.location.href = "create-blog.html";
        return;
    }

}
