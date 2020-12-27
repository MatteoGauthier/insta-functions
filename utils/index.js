require("dotenv").config();
const fetch = require("node-fetch");

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const { createApi } = require("unsplash-js");

const unsplash = createApi({
  accessKey: process.env.UNSPLASH,
});

module.exports = {
  async getTopicsImage(topic = "wallpapers") {
    const data = await (
      await fetch(`https://api.unsplash.com/topics/${topic}/photos?client_id=${process.env.UNSPLASH}&per_page=100`)
    ).json();

    return data;
  },

  async getImageVision(image_id) {
    return await fetch("https://instagen.cau.cx/.netlify/functions/gethashtags", {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify({
        input: `https://source.unsplash.com/${image_id}`,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
      });
  },
  getMeta({ user, location, exif, id }, imageVision) {
    return {
      author: "@" + (user.instagram_username ? user.instagram_username : user.name),
      location: location.name ? location.name : "Somewhere on the planet",
      exif: exif.model ? exif.model : "Iphone X",
      tags: [
        ...imageVision.outputs[0].data.concepts.map(
          (elm) => `#${elm.name.toLowerCase().replace(" ", "").replace("(", "").replace(")", "")}`
        ),
        "#ig_masterpiece",
        "#jaw_dropping_shots",
        "#fingerprintofgod",
        "#wonderful_places",
        "#fiftyshades_of_twilight",
        "#skylover",
        "#ig_world_photo",
        "#sunsetsniper",
      ].join(" "),
      image: `https://source.unsplash.com/${id}`,
      download_url: `https://unsplash.com/photos/${id}`,
    };
  },
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
