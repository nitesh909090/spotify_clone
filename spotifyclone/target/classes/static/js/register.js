async function registerUser() {

    const usernameElement =
        document.getElementById("username");

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const username =
        usernameElement.value.trim();

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value.trim();

    if (!username || !email || !password) {

        alert("Saari details enter karo");

        return;
    }

    if (password.length < 6) {

        alert(
            "Password minimum 6 characters ka hona chahiye"
        );

        return;
    }

    try {

        const response = await fetch(
            "/user/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
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
                "Registration failed"
            );

            return;
        }

        alert(
            "Registration Successful"
        );

        window.location.href =
            "/login";

    } catch (error) {

        console.error(
            "Register Error:",
            error
        );

        alert(
            "Backend se connection nahi ho raha"
        );
    }
}