const { getTopicsImage, getImageVision, randomInteger, getMeta } = require("./utils");
const { createApi } = require("unsplash-js");

const unsplash = createApi({
  accessKey: process.env.UNSPLASH,
});

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);


(async function () {
  const topicsImages = await getTopicsImage();
  console.log(topicsImages[randomInteger(0, topicsImages.length-1)].id);
  const { response: image } = await unsplash.photos.get({
    photoId: topicsImages[randomInteger(0, topicsImages.length)].id,
  });

  const vision = await getImageVision(image.id);
  const meta = getMeta(image, vision);

  const formatted = `Shot on ${meta.exif} by ${meta.author}

  📍 ${meta.location}
  ✈️ DM me to Download
  
      
  ${meta.tags}`;

  await bot.telegram.sendMessage(process.env.chat_id, formatted);

  await bot.telegram.sendPhoto(process.env.chat_id, meta.image);
  await bot.telegram.sendMessage(process.env.chat_id, meta.download_url);

})();
