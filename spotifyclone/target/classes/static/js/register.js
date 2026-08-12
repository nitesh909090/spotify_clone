async function registerUser() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
        username: username,
        email: email,
        password: password
    };

    try {

        const response = await fetch(
            "http://localhost:8080/user/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        if(response.ok){
            alert("Registration Successful");
            window.location.href="login.html";
        }else{
            alert("Registration Failed");
        }

    } catch(error){
        console.log(error);
        alert("Server Error");
    }
}