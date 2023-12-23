$("#menu").on("click", () =>{
    $("nav ul").toggle();
});

$(function () {
    $("#signup").hide();
    $("#password2").hide();
});

const serverUrl = "http://localhost:3000";

function signin() {
    const newURL = `${serverUrl}/signin`;
    window.location.href = newURL;
}

$(document).ready(() =>{
    if($("#title").text() === "Signin to your Account"){
        $(document).keypress(function(event){
            if(event.key === "Enter"){
                $("#signin").click();
            }
        });
    } else{
        $(document).keypress(function(event){
            if(event.key === "Enter"){
                $("#signup").click();
            }
        });   
    }
});

$("#signin").on("click", function post() {
    let email = $("#email").val();
    let password = $("#password1").val();
    let data = { email: email, password: password };

    axios.post(`${serverUrl}/signin`, data)
        .then(response => {
            console.log(response.data);
            handleSignInResponse(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});

function handleSignInResponse(responseData) {
    switch (responseData.success) {
        case 1:
            window.location.href = `${serverUrl}/user`;
            break;
        case 0:
            alert("Verify your credentials");
            break;
        case -1:
            alert("It seems like you are not registered, Please Sign Up");
            break;
        default:
            console.error("Invalid response from the server");
    }
}

$("#signup").on("click", function post() {
    let email = $("#email").val();
    let password = $("#password1").val();
    let confirmedPassword = $("#password2").val();

    if (password === confirmedPassword) {
        let data = { email: email, password: password };

        axios.post(`${serverUrl}/signup`, data)
            .then(response => {
                console.log(response.data);

                if (response.data.success) {
                    alert("Registration Successful, You can now sign in");
                } else if (!response.data.success) {
                    alert("A user with this username already exists, try signing in");
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        alert("Passwords do not match");
    }
});

$("#a").on("click", function () {
    if ($("#title").text() === "Signin to your Account") {
        $("#title").text("Register");
        $("#p").text("Already registered?");
        $("#a").text("Sign In");
        $("#forgetpass").hide();
        $("#password2").show();
        $("#signin").hide();
        $("#signup").show();
    } else {
        $("#title").text("Signin to your Account");
        $("#p").text("New User?");
        $("#a").text("Register");
        $("#forgetpass").show();
        $("#password2").hide();
        $("#signin").show();
        $("#signup").hide();
    }
});
