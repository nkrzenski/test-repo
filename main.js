console.log("here");
const clientId = "04a301ccb9094be690ff7fea8d0d4db2";
const scope = "user-read-email";
const redirectUri = "http://localhost:5500"
const state = crypto.randomUUID().split('-').join('');

// if (!location.search) {
//     location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`
// }

// const params = location.search.substring(1).split("&").map(x => {
//     const q = x.split('=');
//     return { [q[0]]: q[1] };
// });

// console.log(params);
