const clientId = "04a301ccb9094be690ff7fea8d0d4db2";
const scope = "user-read-email";
const redirectUri = "http://localhost:5500"
const state = crypto.randomUUID().split('-').join('');

const hash = location.hash.substring(1).split("&").map(x => {
    const q = x.split('=');
    return { [q[0]]: q[1] };
});

console.log(hash);


document.addEventListener('DOMContentLoaded', () => {

    document.querySelector(".search-section").addEventListener('keypress', async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const input = event.target.value.trim().toLowerCase();

            if (!input) return;

            const playlists = await fetch(`/playlists`, { headers: { q: input } }).then(response => response.json());
            const found = findInPlaylists(playlists, input);

            renderFound(found);
        }
    });

    document.querySelector(".update-btn").addEventListener('click', async (event) => {
        console.log("clock")
        await fetch(`/playlists`, { cache: "no-cache", headers: { q: "abc" } }).then(response => response.json());
    });

});

function renderFound(found) {
    console.log("found", found);
    const elements = [];
    const grouped = _.groupBy(Object.values(found), "playlist");

    console.log(grouped);

    for (let [key, value] of Object.entries(grouped)) {
        const item = $("<div class=\"found-item\">").html(`
            <h1 class="playlist-name">${key}</h1>
        `);

        for (let track of value) {
            const artists = [];
            for (let artist of track.artists) {
                artists.push(artist.name);
            }
            const imgSrc = track.album.images[2]?.url;
            item.append(`
                <div class="track ${!imgSrc ? "not-avail" : ""}">
                <div class="album-cover">
                    <img src="${imgSrc || "https://i.scdn.co/image/ab6775700000ee85aeb6fb34fde89e0c758f7bbb"}" width=64 height=64 />
                    <svg role="img" height="16" width="16" viewBox="0 0 16 16" class="Svg-ytk21e-0 jAKAlG"><path d="M10 2v9.5a2.75 2.75 0 11-2.75-2.75H8.5V2H10zm-1.5 8.25H7.25A1.25 1.25 0 108.5 11.5v-1.25z"></path></svg>
                </div>
                <div class="track-content">
                    <span class="track-name">${track.name}</span>
                    <span class="artists">${artists.join(', ')}</span>
                </div>
                </div>
            `);
        }

        elements.push(item);
    }
    console.log(elements)
    $(".list-section").empty();
    $(".list-section").append(elements);
}

function findInPlaylists(playlists, input) {
    const found = {};

    try {
        for (let playlist of playlists) {
            for (let { track } of playlist.tracks) {
                if (found[track.id]) continue;

                // check track name
                if (track.name.toLowerCase().includes(input)) {
                    found[track.id] = { playlist: playlist.name, ...track };
                } else {
                    // Check artist
                    for (let artist of track.artists) {
                        if (artist.name.toLowerCase().includes(input)) {
                            found[track.id] = { playlist: playlist.name, ...track };
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error(e)
    }

    return found;
}