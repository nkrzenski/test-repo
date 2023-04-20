console.log("here");
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

    document.querySelector(".search-section").addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const input = event.target.value.trim();

        }
    });

});