import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: "10s", target: 5},
        { duration: "10s", target: 15 },
        { duration: "10s", target: 25 },
       
    ],
    cloud: {
        projectID: "3741271",
        name: "MiniTwitter"
    }
};

export default () => {
    let Data_Login = JSON.stringify({
        email: "avazbekmambetov9@gmail.com",
        password: "1234",
        platform: "web",
    });

    let uniqueId = Math.random().toString(36).substring(2, 8);
    let emailDomain = "gmail.com";

    let Data_Register = JSON.stringify({
        full_name: "Test",
        user_type: "user",
        user_role: "user",
        username: `test+${uniqueId}`,
        email: `test+${uniqueId}@${emailDomain}`,
        profile_picture: `${uniqueId}`,
        status: "inverify",
        password: "1234",
        gender: "male",
        
    });
    

    let loginParams = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Login request
    const resLogin = http.post('http://localhost:8080/v1/auth/login', Data_Login, loginParams);
    let token = resLogin.json('user.access_token');
    let userid = resLogin.json('user.id');
    console.log('Access Token:', token);

    let registerParams = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    };


    check(resLogin, {
        "status code 200": (r) => r.status === 200
    });

    const resRegister = http.post('http://localhost:8080/v1/user/', Data_Register, registerParams);

    check(resRegister, {
        "status code 201": (r) => r.status === 201
    });

    const resGetSingleUser = http.get(`http://localhost:8080/v1/user/${userid}`, registerParams);

    check(resGetSingleUser, {
        "status code 200": (r) => r.status === 200
    });

};

