import { fetchRequest } from "../api";
import { ENDPOINT, logOut, SECTIONTYPE } from "../common";


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

const onPlayListItemClicked = (event, id) => {
    console.log(event.target);
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };
    history.pushState(section, "", `playlist/${id}`);
    loadSection(section);
}

const loadPlaylist = async (endpoint, elementId) => {
    const { playlists: { items } } = await fetchRequest(endpoint);
    const playListitemsSection = document.querySelector(elementId);
    // let playListItems = ``;
    for (let { name, description, images, id } of items) {
        const playListItem = document.createElement("section");
        playListItem.id = id;
        playListItem.className = "bg-black-secondary rounded p-4  hover:cursor-pointer hover:bg-light-black";
        playListItem.setAttribute("data-type", "playlist")
        playListItem.addEventListener("click", (event) => onPlayListItemClicked(event, id))
        const [{ url: imageUrl }] = images;

        playListItem.innerHTML = ` 
        <img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow" />
        <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
        <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`
        playListitemsSection.appendChild(playListItem)
        // playListItems += `<section class="rounded p-4 border-2 border-solid">
        //     <img src="${imageUrl}" alt="${name}" />
        //     <h2>${name}</h2>
        //     <h3>${description}</h3>
        // </section>`
    }
    // playListitemsSection.innerHTML = playListItems

}

const loadPlaylists = () => {
    loadPlaylist(ENDPOINT.featuredPlaylist, "#featured-playlist-items");
    loadPlaylist(ENDPOINT.topLists, "#top-playlist-items");
}

const fillContentDashboard = () => {
    const pageContent = document.querySelector("#page-content")
    const playlistMap = new Map([["featured", "featured-playlist-items"], ["top playlists", "top-playlist-items"]]);
    let innerHTML = "";
    for (let [type, id] of playlistMap) {
        innerHTML += `
        <article class="p-4">
            <h1 class="text-2xl mb-4 capitalize font-bold">${type}</h1>
            <section class="featured-songs grid grid-cols-auto-fill-cards gap-4" id="${id}">
            </section>
        </article>`
    }
    pageContent.innerHTML = innerHTML;
}

const loadPlaylistTracks = ({ tracks }) => {
    const trackSections = document.querySelector("#tracks");
    let trackNo = 1;
    for (let trackItem of tracks.items) {
        let { id, artists, name, album, duration_ms: duration } = trackItem.track;
        let track = document.createElement("section");
        track.id = id;
        track.className = "track p-1 items-center justify-items-start rounded-md hover:bg-light-black grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary";
        let image = album.images.find(img => img.height === 64);
        track.innerHTML = `
            <p class="justify-self-center">${trackNo++}</p>
            <section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
                <img src="${image.url}" alt="${name}" class="h-8 w-8" />
                <article class="flex flex-col">
                    <h2 class="text-primary text-xl">${name}</h2>
                    <p class="text-sm">${Array.from(artists, artist => artist.name).join(", ")}</p>
                </article>
            </section>
            <p>${album.name}</p>
            <p>${formatTime(duration)}</p>
        `;
        trackSections.appendChild(track)
    }

}

const formatTime = (duration) => {
    const min = Math.floor(duration / 60_000);
    const sec = ((duration % 6_000) / 1000).toFixed(0);
    const formattedTime = sec == 60 ? min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
    return formattedTime;
}

const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
    const pageContent = document.querySelector("#page-content");
    pageContent.innerHTML = `
        <header class="px-8 py-4" id="playlist-header">
            <nav>
                <ul class="grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary">
                    <li class="justify-self-center">#</li>
                    <li>Title</li>
                    <li>Album</li>
                    <li class="justify-self-center">Duration</li>
                </ul>
            </nav>
        </header>

        <section class="px-8 text-secondary" id="tracks"></section>
    `
    loadPlaylistTracks(playlist);

    console.log(playlist)
}
const onContentScroll = (e) => {
    const { scrollTop } = e.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight) {
        header.classList.add("sticky", "top-0", "bg-black-secondary");
        header.classList.remove("bg-transparent");
    }
    else {
        header.classList.remove("sticky", "top-0", "bg-black-secondary");
        header.classList.add("bg-transparent");
    }
    if (history.state.type === SECTIONTYPE.PLAYLIST) {
        const playlistHeader = document.querySelector("#playlist-header");

        if (scrollTop >= playlistHeader.offsetHeight) {
            playlistHeader.classList.add("sticky", `top-[${header.offsetHeight}px]`)
        }
    }
}


const loadSection = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD) {
        fillContentDashboard();
        loadPlaylists();
    }
    else if (section.type === SECTIONTYPE.PLAYLIST) {
        fillContentForPlaylist(section.playlist)
    }



    document.querySelector(".content").removeEventListener("scroll", onContentScroll)
    document.querySelector(".content").addEventListener("scroll", onContentScroll)


}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "");
    loadSection(section)
    // fillContentDashboard();
    // loadPlaylists();
    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    })
    window.addEventListener("popstate", (event) => {
        loadSection(event.state);
    })


})