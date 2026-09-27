const API_URL = "http://localhost:5000/api";


// =====================================================
// REGISTER
// =====================================================

async function registerUser(event) {

    event.preventDefault();


    const username =
        document
            .getElementById("registerUsername")
            .value
            .trim();


    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("registerPassword")
            .value;


    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    // Basic validation

    if (
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }


    if (password !== confirmPassword) {

        alert(
            "Passwords do not match."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Registration failed."
            );

            return;
        }


        alert(
            "Account created successfully!"
        );


        // Go to login page

        window.location.href =
            "login.html";


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        alert(
            "Cannot connect to server."
        );

    }

}


// =====================================================
// LOGIN
// =====================================================

async function loginUser(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Login failed."
            );

            return;
        }


        // Save JWT

        localStorage.setItem(
            "token",
            data.token
        );


        // Save user

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        alert(
            "Login successful!"
        );


        // Go to Home

        window.location.href =
            "index.html";


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        alert(
            "Cannot connect to server."
        );

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logout(event) {

    if (event) {
        event.preventDefault();
    }


    // Remove authentication data

    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "user"
    );


    // Go to login

    window.location.href =
        "login.html";

}


// =====================================================
// AUTH PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // Register form

        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );

        }


        // Login form

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );

        }

    }
);