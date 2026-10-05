async function loginUser() {

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value.trim();

    if (!email || !password) {

        alert("Email aur password enter karo");

        return;
    }

    try {

        const response = await fetch("/user/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Invalid Email Or Password"
            );

            return;
        }

        localStorage.setItem(
            "user",
            JSON.stringify(data)
        );

        alert("Login Successful");

        window.location.href = "/";

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        alert(
            "Backend se connection nahi ho raha"
        );
    }
}