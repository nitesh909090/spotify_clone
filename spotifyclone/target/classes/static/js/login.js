async function loginUser(){

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const response = await fetch(
        "http://localhost:8080/user/login",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if(data){

        alert("Login Success");

        window.location.href =
            "index.html";

    }else{

        alert("Invalid Email Or Password");
    }
}