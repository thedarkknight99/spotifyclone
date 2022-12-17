import { fetchRequest } from "../api";
import { ENDPOINT, logOut } from "../common";


const onProfileClick = (event) => {
    event.stopPropagation(); ``
    const profileMenu = document.querySelector("#profile-menu");
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logOut)
    }
}

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("#default-image");
    const profileButton = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name");

    const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userInfo);
    if (images?.length) {
        defaultImage.classList.add("hidden");
    }
    else {
        defaultImage.classList.remove("hidden");
    }

    profileButton.addEventListener("click", onProfileClick)

    displayNameElement.textContent = displayName;
}

const onPlayListItemClicked = (event) => {
    console.log(event.target);
}

const loadFeaturedPlaylist = async () => {
    const { playlists: { items } } = await fetchRequest(ENDPOINT.featuredPlaylist);
    const playListitemsSection = document.querySelector("#featured-playlist-items");
    // let playListItems = ``;
    for (let { name, description, images, id } of items) {
        const playListItem = document.createElement("section");
        playListItem.id = id;
        playListItem.className = "rounded p-4 border-2 border-solid hover:cursor-pointer";
        playListItem.setAttribute("data-type", "playlist")
        playListItem.addEventListener("click", onPlayListItemClicked)
        const [{ url: imageUrl }] = images;

        playListItem.innerHTML = ` 
        <img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow" />
        <h2>${name}</h2>
        <h3>${description}</h3>`
        playListitemsSection.appendChild(playListItem)
        // playListItems += `<section class="rounded p-4 border-2 border-solid">
        //     <img src="${imageUrl}" alt="${name}" />
        //     <h2>${name}</h2>
        //     <h3>${description}</h3>
        // </section>`
    }
    // playListitemsSection.innerHTML = playListItems

}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    loadFeaturedPlaylist();
    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    })
})