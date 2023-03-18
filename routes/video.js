var express = require('express');
const fs = require('fs');
const fsProm = require('fs/promises');
const formidable = require('express-formidable');
const path = require('path');

var router = express.Router();
// unbuffered example, you can compare it to buffered. Better use buffered
router.get('/unbuffered/:filename/:resolution?', async function (req, res) {
  let { filename, resolution } = req.params;
  if (resolution) {
    filename += `_${resolution}`;
  }

  const videoPath = `assets/videos/${filename}.mp4`;
  const videoStat = await fsProm.stat(videoPath);
  const fileSize = videoStat.size;
  const filenameToDownload = '2 girls, 1 cop.mp4';
  res.writeHead(200, {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
    'Content-Disposition': `attachment; filename="${filenameToDownload}"`,
  });
  const video = await fsProm.readFile(videoPath);
  res.end(video);
});

router.get('/buffered/:filename/:resolution?', async function (req, res) {
  // <video> element usually doesn't require end range, so we should cap it
  // to avoid big data writing once
  let chunkSize = 2 * 1024 * 1024; // 2 MB
  let { filename, resolution } = req.params;
  if (resolution) {
    filename += `_${resolution}`;
  }

  const videoPath = `assets/videos/${filename}.mp4`;
  const videoStat = await fsProm.stat(videoPath);
  const fileSize = videoStat.size;
  const videoRange = req.headers.range;
  // if no Range header, return video fully for downloading
  if (!videoRange) {
    const filenameToDownload = '2 girls, 1 cop.mp4';
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="${filenameToDownload}"`,
    });
    // buffered writing is preferable
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  // if there are Range header parse requested range in bytes
  const parts = videoRange.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : Math.min(fileSize - 1, start + chunkSize);

  // important to return 206 code 'Partially filled
  // all headers are important here
  chunkSize = end - start + 1;
  res.writeHead(206, {
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
  });

  // you don't need to open file fully, just seek at specified byte offset
  fs.createReadStream(videoPath, { start, end }).pipe(res);
});

router.post('/upload', formidable({ uploadDir: 'assets/videos' }), async (req, res) => {
  const video = req.files.video;
  const dirname = path.dirname(video.path);
  await fsProm.rename(video.path, path.join(dirname, video.name));
  res.end();
});

module.exports = router;
