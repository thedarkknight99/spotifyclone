import queryString from 'query-string';
import { ACCESS_TOKEN, TOKEN_TYPE, EXPIRES_IN } from '../common';


const loginButton = document.querySelector("#spotify-login");


const client_id = import.meta.env.VITE_CLIENT_ID
const scope = "user-top-read user-follow-read  playlist-read-private user-library-read";


const redirect_uri = import.meta.env.VITE_REDIRECT_URI
const APP_URL = import.meta.env.VITE_APP_URL
// const ACCESS_TOKEN_KEY = "accessToken";

const authorizeUser = () => {
    const url = 'https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'token',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            show_dialog: true
        });

    // console.log(url)
    window.open(url, "login", "width=800,height=600")
}

document.addEventListener("DOMContentLoaded", () => {
    loginButton.addEventListener("click", authorizeUser);
})
window.setItemsInLocalStorage = ({ accessToken, tokenType, expiresIn }) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_TYPE, tokenType);
    localStorage.setItem(EXPIRES_IN, (Date.now() + (expiresIn * 1000)));
    window.location.href = APP_URL
}
window.addEventListener("load", () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    if (accessToken) {
        window.location.href = `${APP_URL}/dashboard/dashboard.html`
    }

    //if popup is still open or is not closed
    if (!window.opener !== null && !window.opener.closed) {
        window.focus();
        if (window.location.href.includes("error")) {
            window.close();
        }

        // console.log(window.location.hash)
        const searchParams = new URLSearchParams(window.location.hash);
        const accessToken = searchParams.get("#access_token");
        const tokenType = searchParams.get("token_type");
        const expiresIn = searchParams.get("expires_in");
        if (accessToken) {
            window.close()
            window.opener.setItemsInLocalStorage({ accessToken, tokenType, expiresIn });

        }
        else {
            window.close()
        }
    }
})